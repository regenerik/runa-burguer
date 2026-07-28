/* Backend Google Sheets para Runa Burger.
 * Mantiene el formulario/cupon actual y agrega CRUD de productos.
 * Pegar completo en Apps Script y configurar Script Properties.
 */

const RESPONSES_SHEET_NAME = "Respuestas";
const PRODUCTS_SHEET_NAME = "products";

const PRODUCT_HEADERS = [
  "id",
  "type",
  "title",
  "subtitle",
  "description",
  "price",
  "imageUrl",
  "imagePublicId",
  "imageKey",
  "hasOptions",
  "optionsTitle",
  "options",
  "available",
  "hidden",
  "sortOrder",
  "createdAt",
  "updatedAt",
];

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function getConfig() {
  const properties = PropertiesService.getScriptProperties();
  return {
    apiToken: properties.getProperty("API_TOKEN") || "",
    adminEmail: properties.getProperty("ADMIN_EMAIL") || "",
    adminPassword: properties.getProperty("ADMIN_PASSWORD") || "",
    adminPasswordSha256: properties.getProperty("ADMIN_PASSWORD_SHA256") || "",
    cloudName: properties.getProperty("CLOUDINARY_CLOUD_NAME") || "",
    cloudinaryApiKey: properties.getProperty("CLOUDINARY_API_KEY") || "",
    cloudinaryApiSecret: properties.getProperty("CLOUDINARY_API_SECRET") || "",
    allowedFolders: (properties.getProperty("CLOUDINARY_ALLOWED_FOLDERS") || "")
      .split(",")
      .map((folder) => folder.trim().replace(/^\/+|\/+$/g, ""))
      .filter(Boolean),
  };
}

function isAuthorized(token) {
  if (!token) return false;
  const config = getConfig();
  if (config.apiToken && String(token) === config.apiToken) return true;
  return Boolean(readAdminSessionToken(String(token)));
}

function getOrCreateSheet(name, headers) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) sheet = spreadsheet.insertSheet(name);
  if (headers && sheet.getLastRow() === 0) sheet.appendRow(headers);
  if (headers) ensureHeaders(sheet, headers);
  return sheet;
}

function ensureHeaders(sheet, headers) {
  const existing = sheet.getLastColumn() > 0
    ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String)
    : [];
  headers.forEach((header) => {
    if (!existing.includes(header)) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(header);
      existing.push(header);
    }
  });
}

function headerMap(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .reduce((map, header, index) => {
      map[String(header)] = index;
      return map;
    }, {});
}

function parseJsonArray(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function toBoolean(value, fallback) {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return fallback;
}

function normalizeOption(option, index) {
  return {
    id: String(option.id || `option-${index + 1}`),
    name: String(option.name || ""),
    subtitle: String(option.subtitle || ""),
    price: Number(option.price || 0),
    imageUrl: String(option.imageUrl || ""),
    imagePublicId: String(option.imagePublicId || ""),
    imageKey: String(option.imageKey || ""),
    sortOrder: Number(option.sortOrder || (index + 1) * 10),
  };
}

function rowToProduct(row, headers) {
  const get = (name) => row[headers[name]] ?? "";
  return {
    id: String(get("id")),
    type: String(get("type") || "main"),
    title: String(get("title") || ""),
    subtitle: String(get("subtitle") || ""),
    description: String(get("description") || ""),
    price: Number(get("price") || 0),
    imageUrl: String(get("imageUrl") || ""),
    imagePublicId: String(get("imagePublicId") || ""),
    imageKey: String(get("imageKey") || ""),
    hasOptions: toBoolean(get("hasOptions"), false),
    optionsTitle: String(get("optionsTitle") || ""),
    options: parseJsonArray(get("options")).map(normalizeOption).filter((option) => option.name),
    available: toBoolean(get("available"), true),
    hidden: toBoolean(get("hidden"), false),
    sortOrder: Number(get("sortOrder") || 0),
    createdAt: String(get("createdAt") || ""),
    updatedAt: String(get("updatedAt") || ""),
  };
}

function productToRow(product, headers) {
  const now = new Date().toISOString();
  const normalized = normalizeProduct(product);
  const rowByHeader = {
    id: normalized.id,
    type: normalized.type,
    title: normalized.title,
    subtitle: normalized.subtitle,
    description: normalized.description,
    price: normalized.price,
    imageUrl: normalized.imageUrl,
    imagePublicId: normalized.imagePublicId,
    imageKey: normalized.imageKey,
    hasOptions: normalized.hasOptions,
    optionsTitle: normalized.optionsTitle,
    options: JSON.stringify(normalized.options || []),
    available: normalized.available,
    hidden: normalized.hidden,
    sortOrder: normalized.sortOrder,
    createdAt: normalized.createdAt || now,
    updatedAt: now,
  };
  return Object.keys(headers).map((header) => rowByHeader[header] ?? "");
}

function normalizeProduct(product) {
  if (!product || !product.id || !product.title) throw new Error("Producto invalido: faltan id o titulo.");
  const hasOptions = toBoolean(product.hasOptions, false);
  return {
    id: String(product.id),
    type: ["main", "extra", "drink"].includes(String(product.type)) ? String(product.type) : "main",
    title: String(product.title),
    subtitle: String(product.subtitle || ""),
    description: String(product.description || ""),
    price: Number(product.price || 0),
    imageUrl: String(product.imageUrl || ""),
    imagePublicId: String(product.imagePublicId || ""),
    imageKey: String(product.imageKey || ""),
    hasOptions: hasOptions,
    optionsTitle: String(product.optionsTitle || ""),
    options: hasOptions ? (Array.isArray(product.options) ? product.options : []).map(normalizeOption).filter((option) => option.name) : [],
    available: toBoolean(product.available, true),
    hidden: toBoolean(product.hidden, false),
    sortOrder: Number(product.sortOrder || 0),
    createdAt: String(product.createdAt || ""),
    updatedAt: String(product.updatedAt || ""),
  };
}

function getProductsSheet() {
  return getOrCreateSheet(PRODUCTS_SHEET_NAME, PRODUCT_HEADERS);
}

function listProducts(includeHidden) {
  const sheet = getProductsSheet();
  if (sheet.getLastRow() < 2) return [];
  const headers = headerMap(sheet);
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues()
    .map((row) => rowToProduct(row, headers))
    .filter((product) => product.id && (includeHidden || !product.hidden))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

function findProductRow(sheet, id) {
  if (sheet.getLastRow() < 2) return null;
  const headers = headerMap(sheet);
  const idColumn = headers.id + 1;
  const match = sheet.getRange(2, idColumn, sheet.getLastRow() - 1, 1)
    .createTextFinder(String(id))
    .matchEntireCell(true)
    .findNext();
  return match ? match.getRow() : null;
}

function getProductById(sheet, id) {
  const row = findProductRow(sheet, id);
  return row ? rowToProduct(sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0], headerMap(sheet)) : null;
}

function upsertProduct(product) {
  const sheet = getProductsSheet();
  const normalized = normalizeProduct(product);
  const headers = headerMap(sheet);
  const row = productToRow(normalized, headers);
  const previous = getProductById(sheet, normalized.id);
  const existingRow = findProductRow(sheet, normalized.id);
  if (existingRow) sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
  else sheet.appendRow(row);
  cleanupReplacedImages(previous, normalized);
  return { ok: true, product: normalized };
}

function deleteProduct(id) {
  const sheet = getProductsSheet();
  const row = findProductRow(sheet, id);
  if (!row) return { ok: true };
  const previous = rowToProduct(sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0], headerMap(sheet));
  sheet.deleteRow(row);
  try {
    deleteCloudinaryAssets(productAssetIds(previous));
    return { ok: true };
  } catch (error) {
    return { ok: true, warning: `Producto eliminado, pero no se pudieron limpiar algunas imagenes: ${String(error.message || error)}` };
  }
}

function productAssetIds(product) {
  if (!product) return [];
  const ids = [];
  if (product.imagePublicId) ids.push(product.imagePublicId);
  if (!product.imagePublicId && product.imageUrl) {
    const parsed = cloudinaryPublicIdFromUrl(product.imageUrl);
    if (parsed) ids.push(parsed);
  }
  (Array.isArray(product.options) ? product.options : []).forEach((option) => {
    if (option.imagePublicId) ids.push(option.imagePublicId);
    else if (option.imageUrl) {
      const parsed = cloudinaryPublicIdFromUrl(option.imageUrl);
      if (parsed) ids.push(parsed);
    }
  });
  return [...new Set(ids.filter(Boolean).map(String))];
}

function cleanupReplacedImages(previous, next) {
  const nextIds = new Set(productAssetIds(next));
  const replaced = productAssetIds(previous).filter((publicId) => !nextIds.has(publicId));
  if (!replaced.length) return;
  try {
    deleteCloudinaryAssets(replaced);
  } catch (error) {
    // No bloquea el guardado del producto.
  }
}

function cloudinaryPublicIdFromUrl(imageUrl) {
  if (!imageUrl || String(imageUrl).indexOf("res.cloudinary.com/") < 0) return null;
  const marker = "/image/upload/";
  const markerIndex = String(imageUrl).indexOf(marker);
  if (markerIndex < 0) return null;
  const path = String(imageUrl).slice(markerIndex + marker.length).split("?")[0];
  const segments = path.split("/");
  const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment));
  const assetSegments = versionIndex >= 0 ? segments.slice(versionIndex + 1) : segments;
  if (!assetSegments.length) return null;
  assetSegments[assetSegments.length - 1] = assetSegments[assetSegments.length - 1].replace(/\.[^/.]+$/, "");
  return assetSegments.filter(Boolean).join("/") || null;
}

function validateCloudinaryPublicIds(publicIds, config) {
  if (!publicIds.length) return;
  if (!config.cloudName || !config.cloudinaryApiKey || !config.cloudinaryApiSecret || !config.allowedFolders.length) {
    throw new Error("Falta configuracion privada de Cloudinary.");
  }
  publicIds.forEach((publicId) => {
    const allowed = config.allowedFolders.some((folder) => String(publicId).indexOf(folder + "/") === 0);
    if (!allowed) throw new Error("Se intento eliminar una imagen fuera de las carpetas permitidas.");
  });
}

function sha1Hex(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_1, value, Utilities.Charset.UTF_8)
    .map((byte) => (byte < 0 ? byte + 256 : byte).toString(16).padStart(2, "0"))
    .join("");
}

function sha256Hex(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(value), Utilities.Charset.UTF_8)
    .map((byte) => (byte < 0 ? byte + 256 : byte).toString(16).padStart(2, "0"))
    .join("");
}

function base64WebSafe(value) {
  return Utilities.base64EncodeWebSafe(String(value), Utilities.Charset.UTF_8).replace(/=+$/g, "");
}

function signAdminSession(payload) {
  const config = getConfig();
  if (!config.apiToken) throw new Error("Falta API_TOKEN.");
  const body = base64WebSafe(JSON.stringify(payload));
  const signature = Utilities.base64EncodeWebSafe(
    Utilities.computeHmacSha256Signature(body, config.apiToken)
  ).replace(/=+$/g, "");
  return `${body}.${signature}`;
}

function readAdminSessionToken(token) {
  try {
    const parts = String(token || "").split(".");
    if (parts.length !== 2) return null;
    const body = parts[0];
    const signature = parts[1];
    const config = getConfig();
    if (!config.apiToken) return null;
    const expected = Utilities.base64EncodeWebSafe(
      Utilities.computeHmacSha256Signature(body, config.apiToken)
    ).replace(/=+$/g, "");
    if (signature !== expected) return null;
    const payload = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(body)).getDataAsString());
    if (!payload.exp || Number(payload.exp) < Date.now()) return null;
    return payload;
  } catch (error) {
    return null;
  }
}

function adminLogin(email, password) {
  const config = getConfig();
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const expectedEmail = String(config.adminEmail || "").trim().toLowerCase();
  const plainPasswordOk = Boolean(config.adminPassword && String(password || "") === config.adminPassword);
  const hashPasswordOk = Boolean(config.adminPasswordSha256 && sha256Hex(String(password || "")) === config.adminPasswordSha256);
  if (!expectedEmail || normalizedEmail !== expectedEmail || (!plainPasswordOk && !hashPasswordOk)) {
    return { ok: false, error: "Email o contrasena incorrectos." };
  }
  return {
    ok: true,
    service: "products",
    token: signAdminSession({
      email: normalizedEmail,
      exp: Date.now() + 1000 * 60 * 60 * 12,
    }),
  };
}

function destroyCloudinaryAsset(publicId, config) {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = sha1Hex(`invalidate=true&public_id=${publicId}&timestamp=${timestamp}${config.cloudinaryApiSecret}`);
  const response = UrlFetchApp.fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/destroy`, {
    method: "post",
    payload: {
      api_key: config.cloudinaryApiKey,
      invalidate: "true",
      public_id: publicId,
      signature: signature,
      timestamp: timestamp,
    },
    muteHttpExceptions: true,
  });
  const result = JSON.parse(response.getContentText() || "{}");
  if (response.getResponseCode() < 200 || response.getResponseCode() >= 300 || result.error) {
    throw new Error((result.error && result.error.message) || `Cloudinary no pudo eliminar ${publicId}.`);
  }
  return result.result || "ok";
}

function deleteCloudinaryAssets(publicIds) {
  const uniqueIds = [...new Set((Array.isArray(publicIds) ? publicIds : []).filter(Boolean).map(String))];
  if (!uniqueIds.length) return [];
  if (uniqueIds.length > 30) throw new Error("Demasiadas imagenes en una sola operacion.");
  const config = getConfig();
  validateCloudinaryPublicIds(uniqueIds, config);
  return uniqueIds.map((publicId) => ({ publicId: publicId, result: destroyCloudinaryAsset(publicId, config) }));
}

function withWriteLock(callback) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    return callback();
  } finally {
    lock.releaseLock();
  }
}

function setupProductSheets() {
  getProductsSheet();
  return "Hojas de productos inicializadas.";
}

function handleProductsPayload(payload) {
  if (payload.action === "adminLogin") {
    return adminLogin(payload.email, payload.password);
  }

  if (payload.action === "listProducts") {
    const includeHidden = Boolean(payload.includeHidden) && isAuthorized(payload.token);
    return { ok: true, service: "products", products: listProducts(includeHidden) };
  }

  if (!isAuthorized(payload.token)) {
    return { ok: false, error: "Clave administrativa incorrecta." };
  }

  if (payload.action === "upsertProduct") return withWriteLock(() => ({ service: "products", ...upsertProduct(payload.product) }));
  if (payload.action === "deleteProduct") return withWriteLock(() => ({ service: "products", ...deleteProduct(payload.id) }));
  if (payload.action === "setupProducts") return { ok: true, service: "products", message: setupProductSheets() };
  return { ok: false, error: "Accion de productos invalida." };
}

function appendCouponResponse(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(RESPONSES_SHEET_NAME) || ss.getActiveSheet();
  const celular = String(data.celular || "").replace(/\D/g, "");

  if (celular && sheet.getLastRow() >= 2) {
    const values = sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues().flat();
    const duplicate = values.some((value) => String(value || "").replace(/\D/g, "") === celular);
    if (duplicate) return { ok: false, reason: "duplicate" };
  }

  sheet.appendRow([
    new Date(),
    data.nombre || "",
    data.celular || "",
    data.preg1 || "",
    data.preg2 || "",
    data.preg3 || "",
    data.libre || "",
  ]);
  return { ok: true };
}

function authorizeExternalRequests() {
  const response = UrlFetchApp.fetch("https://api.cloudinary.com", {
    method: "get",
    muteHttpExceptions: true,
  });
  return `Permiso externo habilitado (${response.getResponseCode()}).`;
}

function doGet() {
  setupProductSheets();
  return jsonResponse({ ok: true, service: "runa-burger" });
}

function doPost(event) {
  try {
    const payload = JSON.parse((event.postData && event.postData.contents) || "{}");

    if (payload.service === "products" || String(payload.action || "").indexOf("Product") >= 0) {
      setupProductSheets();
      return jsonResponse(handleProductsPayload(payload));
    }

    return jsonResponse(appendCouponResponse(payload));
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error.message || error) });
  }
}
