/**
 * Security helpers para prevenir injeção de dados do usuário em chaves
 * de banco (wio.db/quick.db), strings de exibição e chamadas externas.
 */

const DISCORD_ID_REGEX = /^\d{17,20}$/;
const SNOWFLAKE_REGEX = /^\d{17,20}$/;
const SAFE_KEY_REGEX = /^[a-zA-Z0-9_.\-:]{1,128}$/;
const SAFE_CODE_REGEX = /^[a-zA-Z0-9_-]{20,128}$/;
const SAFE_USERNAME_REGEX = /^[\w\s\-_.]{1,32}$/;
const SAFE_HEX_COLOR_REGEX = /^#?[0-9a-fA-F]{6}$/;

function sanitize(str, maxLen = 100) {
    if (typeof str !== 'string') return '';
    return str.replace(/[<>\\"'&]/g, '').slice(0, maxLen);
}

function sanitizeKey(key) {
    if (typeof key !== 'string') return '';
    return key.replace(/[^a-zA-Z0-9_.\-:]/g, '').slice(0, 128);
}

function isDiscordId(value) {
    return DISCORD_ID_REGEX.test(String(value));
}

function isSnowflake(value) {
    return SNOWFLAKE_REGEX.test(String(value));
}

function isValidKey(value) {
    return SAFE_KEY_REGEX.test(String(value));
}

function isValidOAuthCode(value) {
    return SAFE_CODE_REGEX.test(String(value));
}

function isValidUsername(value) {
    return SAFE_USERNAME_REGEX.test(String(value));
}

function isValidHexColor(value) {
    return SAFE_HEX_COLOR_REGEX.test(String(value));
}

function encodeUrlParam(value) {
    if (typeof value !== 'string') return '';
    return encodeURIComponent(value);
}

function safeJsonParse(str, fallback = null) {
    try {
        return JSON.parse(str);
    } catch {
        return fallback;
    }
}

module.exports = {
    sanitize,
    sanitizeKey,
    isDiscordId,
    isSnowflake,
    isValidKey,
    isValidOAuthCode,
    isValidUsername,
    isValidHexColor,
    encodeUrlParam,
    safeJsonParse,
};
