/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./platform-service/api/auth.ts":
/*!**************************************!*\
  !*** ./platform-service/api/auth.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"post\": () => (/* binding */ post)\n/* harmony export */ });\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _utils_request_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/request.util */ \"./platform-service/utils/request.util.ts\");\n/* harmony import */ var _utils_response_util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/response.util */ \"./platform-service/utils/response.util.ts\");\n\n\n\nconst respondWithJson = new _utils_response_util__WEBPACK_IMPORTED_MODULE_2__.Response(_utils_response_util__WEBPACK_IMPORTED_MODULE_2__.ResponseFormatters.JSON);\nconst post = async (event) => {\n    let authRequest;\n    try {\n        authRequest = (0,_utils_request_util__WEBPACK_IMPORTED_MODULE_1__.parseWith)(event.body, _utils_request_util__WEBPACK_IMPORTED_MODULE_1__.RequestFormatters.JSON);\n    }\n    catch (err) {\n        return respondWithJson.respond(_utils_response_util__WEBPACK_IMPORTED_MODULE_2__.ResponseCodes.SERVER_ERROR, {\n            message: 'unable to parse request',\n            error: err,\n        });\n    }\n    const jwtData = {\n        email: authRequest.email\n    };\n    const token = jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__.sign(jwtData, process.env.JWT_SECRET, {\n        expiresIn: process.env.AUTH_EXPIRY,\n    });\n    return respondWithJson.respond(_utils_response_util__WEBPACK_IMPORTED_MODULE_2__.ResponseCodes.OK, {\n        message: 'OK',\n        data: {\n            auth_token: token\n        },\n    });\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wbGF0Zm9ybS1zZXJ2aWNlL2FwaS9hdXRoLnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFPQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9pbW11dGFibGV4Ly4vcGxhdGZvcm0tc2VydmljZS9hcGkvYXV0aC50cz8yN2Q1Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFQSUdhdGV3YXlQcm94eUhhbmRsZXIsIEFQSUdhdGV3YXlFdmVudCB9IGZyb20gJ2F3cy1sYW1iZGEnXG5pbXBvcnQgKiBhcyBqd3QgZnJvbSAnanNvbndlYnRva2VuJ1xuaW1wb3J0IHsgcGFyc2VXaXRoLCBSZXF1ZXN0Rm9ybWF0dGVycyB9IGZyb20gJy4uL3V0aWxzL3JlcXVlc3QudXRpbCdcbmltcG9ydCB7IFJlc3BvbnNlRm9ybWF0dGVycywgUmVzcG9uc2VDb2RlcywgUmVzcG9uc2UgfSBmcm9tICcuLi91dGlscy9yZXNwb25zZS51dGlsJ1xuXG5jb25zdCByZXNwb25kV2l0aEpzb24gPSBuZXcgUmVzcG9uc2UoUmVzcG9uc2VGb3JtYXR0ZXJzLkpTT04pXG5cbmludGVyZmFjZSBBdXRoUmVxdWVzdCB7XG4gIGVtYWlsOiBzdHJpbmcsXG4gIHBhc3N3b3JkOiBzdHJpbmcsXG59XG5cbmV4cG9ydCBjb25zdCBwb3N0OiBBUElHYXRld2F5UHJveHlIYW5kbGVyID0gYXN5bmMgKGV2ZW50OiBBUElHYXRld2F5RXZlbnQpOiBQcm9taXNlPGFueT4gPT4ge1xuXG4gIGxldCBhdXRoUmVxdWVzdDpBdXRoUmVxdWVzdFxuXG4gIHRyeSB7XG4gICAgYXV0aFJlcXVlc3QgPSBwYXJzZVdpdGgoZXZlbnQuYm9keSwgUmVxdWVzdEZvcm1hdHRlcnMuSlNPTilcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIHJlc3BvbmRXaXRoSnNvbi5yZXNwb25kKFJlc3BvbnNlQ29kZXMuU0VSVkVSX0VSUk9SLCB7XG4gICAgICBtZXNzYWdlOiAndW5hYmxlIHRvIHBhcnNlIHJlcXVlc3QnLFxuICAgICAgZXJyb3I6IGVycixcbiAgICB9KVxuICB9XG5cbiAgLy9AVE9ETzogY2hlY2sgdXNlciBhdXRoXG5cbiAgY29uc3Qgand0RGF0YSA9IHtcbiAgICBlbWFpbDogYXV0aFJlcXVlc3QuZW1haWxcbiAgfVxuXG4gIGNvbnN0IHRva2VuID0gand0LnNpZ24oand0RGF0YSwgcHJvY2Vzcy5lbnYuSldUX1NFQ1JFVCwge1xuICAgIGV4cGlyZXNJbjogcHJvY2Vzcy5lbnYuQVVUSF9FWFBJUlksXG4gIH0pXG5cbiAgcmV0dXJuIHJlc3BvbmRXaXRoSnNvbi5yZXNwb25kKFJlc3BvbnNlQ29kZXMuT0ssIHtcbiAgICBtZXNzYWdlOiAnT0snLFxuICAgIGRhdGE6IHtcbiAgICAgIGF1dGhfdG9rZW46IHRva2VuXG4gICAgfSxcbiAgfSlcblxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./platform-service/api/auth.ts\n");

/***/ }),

/***/ "./platform-service/utils/helper.util.ts":
/*!***********************************************!*\
  !*** ./platform-service/utils/helper.util.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Utils\": () => (/* binding */ Utils),\n/* harmony export */   \"Values\": () => (/* binding */ Values)\n/* harmony export */ });\nvar Values;\n(function (Values) {\n    Values[Values[\"satoshi\"] = 100000000] = \"satoshi\";\n    Values[Values[\"dollarDecimal\"] = 100] = \"dollarDecimal\";\n    Values[Values[\"mBTC\"] = 100000] = \"mBTC\";\n    Values[Values[\"wei\"] = 1000000000000000000] = \"wei\";\n})(Values || (Values = {}));\nclass Utils {\n    static enumToArray(Enum) {\n        const tmp = [];\n        for (const prop in Enum) {\n            if (Enum.hasOwnProperty(prop)) {\n                tmp.push(Enum[prop]);\n            }\n        }\n        return tmp;\n    }\n    static dollarRounded(value) {\n        if (typeof value == 'string') {\n            value = parseFloat(value);\n        }\n        return Math.round(value * Values.dollarDecimal) / Values.dollarDecimal;\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wbGF0Zm9ybS1zZXJ2aWNlL3V0aWxzL2hlbHBlci51dGlsLnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaW1tdXRhYmxleC8uL3BsYXRmb3JtLXNlcnZpY2UvdXRpbHMvaGVscGVyLnV0aWwudHM/MTUxZCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZW51bSBWYWx1ZXMge1xuICBzYXRvc2hpID0gMTAwMDAwMDAwLFxuICBkb2xsYXJEZWNpbWFsID0gMTAwLFxuICBtQlRDID0gMTAwMDAwLFxuICB3ZWkgPSAxMDAwMDAwMDAwMDAwMDAwMDAwLFxufVxuXG5leHBvcnQgY2xhc3MgVXRpbHMge1xuICBzdGF0aWMgZW51bVRvQXJyYXkoRW51bTphbnkpIHtcbiAgICBcbiAgICBjb25zdCB0bXAgPSBbXVxuXG4gICAgZm9yIChjb25zdCBwcm9wIGluIEVudW0pIHtcbiAgICAgIGlmIChFbnVtLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgIHRtcC5wdXNoKEVudW1bcHJvcF0pXG4gICAgICB9XG4gICAgfVxuICAgICAgXG4gICAgcmV0dXJuIHRtcFxuXG4gIH1cblxuICBzdGF0aWMgZG9sbGFyUm91bmRlZCh2YWx1ZTpzdHJpbmd8bnVtYmVyKSB7XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnKSB7XG4gICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUpXG4gICAgfVxuXG4gICAgcmV0dXJuIE1hdGgucm91bmQodmFsdWUgKiBWYWx1ZXMuZG9sbGFyRGVjaW1hbCkgLyBWYWx1ZXMuZG9sbGFyRGVjaW1hbDtcblxuICB9XG5cbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./platform-service/utils/helper.util.ts\n");

/***/ }),

/***/ "./platform-service/utils/request.util.ts":
/*!************************************************!*\
  !*** ./platform-service/utils/request.util.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"RequestFormatters\": () => (/* binding */ RequestFormatters),\n/* harmony export */   \"parseWith\": () => (/* binding */ parseWith)\n/* harmony export */ });\n/* harmony import */ var _helper_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper.util */ \"./platform-service/utils/helper.util.ts\");\n\nfunction parseWith(data, formatter) {\n    let parsed;\n    if (!data) {\n        throw new Error('[request.util.parseWith] no data to parse');\n    }\n    if (!_helper_util__WEBPACK_IMPORTED_MODULE_0__.Utils.enumToArray(RequestFormatters).includes(formatter)) {\n        throw new Error('[request.util.parseWith] invalid formatter');\n    }\n    try {\n        switch (formatter) {\n            case 'JSON':\n                parsed = JSON.parse(data);\n                break;\n            default:\n                throw new Error('[request.util.parseWith] invalid formatter');\n        }\n        return parsed;\n    }\n    catch (e) {\n        throw new Error('[request.util.parseWith] parser not handled');\n    }\n}\nvar RequestFormatters;\n(function (RequestFormatters) {\n    RequestFormatters[\"JSON\"] = \"JSON\";\n})(RequestFormatters || (RequestFormatters = {}));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wbGF0Zm9ybS1zZXJ2aWNlL3V0aWxzL3JlcXVlc3QudXRpbC50cy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBTUE7QUFBQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9pbW11dGFibGV4Ly4vcGxhdGZvcm0tc2VydmljZS91dGlscy9yZXF1ZXN0LnV0aWwudHM/Yzc0NCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuL2hlbHBlci51dGlsXCJcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlV2l0aChkYXRhOiBzdHJpbmcsIGZvcm1hdHRlcjogUmVxdWVzdEZvcm1hdHRlcnMpOiBhbnkge1xuXG4gIGxldCBwYXJzZWQ6YW55XG5cbiAgaWYgKCFkYXRhKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdbcmVxdWVzdC51dGlsLnBhcnNlV2l0aF0gbm8gZGF0YSB0byBwYXJzZScpXG4gIH1cblxuICBpZiAoIVV0aWxzLmVudW1Ub0FycmF5KFJlcXVlc3RGb3JtYXR0ZXJzKS5pbmNsdWRlcyhmb3JtYXR0ZXIpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdbcmVxdWVzdC51dGlsLnBhcnNlV2l0aF0gaW52YWxpZCBmb3JtYXR0ZXInKVxuICB9XG5cbiAgdHJ5IHtcbiAgICBzd2l0Y2ggKGZvcm1hdHRlcikge1xuICAgICAgY2FzZSAnSlNPTic6XG4gICAgICAgIHBhcnNlZCA9IEpTT04ucGFyc2UoZGF0YSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignW3JlcXVlc3QudXRpbC5wYXJzZVdpdGhdIGludmFsaWQgZm9ybWF0dGVyJylcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VkXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1tyZXF1ZXN0LnV0aWwucGFyc2VXaXRoXSBwYXJzZXIgbm90IGhhbmRsZWQnKVxuICB9XG59XG5cbmV4cG9ydCB0eXBlIFVua25vd25PYmplY3QgPSB7XG4gIFtrZXk6IHN0cmluZ106IGFueVxufVxuXG5leHBvcnQgZW51bSBSZXF1ZXN0Rm9ybWF0dGVycyB7XG4gIEpTT04gPSAnSlNPTicsXG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./platform-service/utils/request.util.ts\n");

/***/ }),

/***/ "./platform-service/utils/response.util.ts":
/*!*************************************************!*\
  !*** ./platform-service/utils/response.util.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Response\": () => (/* binding */ Response),\n/* harmony export */   \"ResponseCodes\": () => (/* binding */ ResponseCodes),\n/* harmony export */   \"ResponseFormatters\": () => (/* binding */ ResponseFormatters),\n/* harmony export */   \"ResponseTypes\": () => (/* binding */ ResponseTypes)\n/* harmony export */ });\nclass Response {\n    constructor(formatter) {\n        this.formatter = formatter;\n        if (process.env.HEADERS) {\n            try {\n                this.headers = JSON.parse(process.env.HEADERS);\n            }\n            catch (error) {\n                throw new Error('unable to parse headers');\n            }\n        }\n    }\n    respond(statusCode, data = null) {\n        if (statusCode < 100 || statusCode > 599) {\n            throw new Error('status code out of range');\n        }\n        const response = {\n            statusCode,\n            headers: {\n                'Access-Control-Allow-Origin': '*',\n                'Access-Control-Allow-Credentials': true,\n            },\n        };\n        if (this.headers) {\n            if (this.headers.allowOrigin)\n                response.headers['Access-Control-Allow-Origin'] = this.headers.allowOrigin;\n            if (this.headers.allowMethods)\n                response.headers['Access-Control-Allow-Methods'] = this.headers.allowMethods;\n        }\n        switch (this.formatter) {\n            case 'JSON':\n                response.body = JSON.stringify(data);\n                break;\n            default:\n                response.body = data;\n        }\n        return response;\n    }\n}\nvar ResponseFormatters;\n(function (ResponseFormatters) {\n    ResponseFormatters[\"JSON\"] = \"JSON\";\n})(ResponseFormatters || (ResponseFormatters = {}));\nvar ResponseCodes;\n(function (ResponseCodes) {\n    ResponseCodes[ResponseCodes[\"BAD_REQUEST\"] = 400] = \"BAD_REQUEST\";\n    ResponseCodes[ResponseCodes[\"UNAUTHORISED\"] = 401] = \"UNAUTHORISED\";\n    ResponseCodes[ResponseCodes[\"OK\"] = 200] = \"OK\";\n    ResponseCodes[ResponseCodes[\"SERVER_ERROR\"] = 500] = \"SERVER_ERROR\";\n})(ResponseCodes || (ResponseCodes = {}));\nvar ResponseTypes;\n(function (ResponseTypes) {\n    ResponseTypes[\"POST\"] = \"post\";\n    ResponseTypes[\"GET\"] = \"get\";\n})(ResponseTypes || (ResponseTypes = {}));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wbGF0Zm9ybS1zZXJ2aWNlL3V0aWxzL3Jlc3BvbnNlLnV0aWwudHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBO0FBSUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQVFBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaW1tdXRhYmxleC8uL3BsYXRmb3JtLXNlcnZpY2UvdXRpbHMvcmVzcG9uc2UudXRpbC50cz85ZjU1Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBSZXNwb25zZSB7XG4gIHByaXZhdGUgZm9ybWF0dGVyOiBSZXNwb25zZUZvcm1hdHRlcnNcbiAgcHJpdmF0ZSBoZWFkZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+XG5cbiAgY29uc3RydWN0b3IoZm9ybWF0dGVyOiBSZXNwb25zZUZvcm1hdHRlcnMpIHtcbiAgICB0aGlzLmZvcm1hdHRlciA9IGZvcm1hdHRlclxuXG4gICAgaWYgKHByb2Nlc3MuZW52LkhFQURFUlMpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuaGVhZGVycyA9IEpTT04ucGFyc2UocHJvY2Vzcy5lbnYuSEVBREVSUylcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5hYmxlIHRvIHBhcnNlIGhlYWRlcnMnKVxuICAgICAgfVxuICAgIH0gICBcblxuICB9XG5cbiAgcmVzcG9uZChzdGF0dXNDb2RlOiBSZXNwb25zZUNvZGVzLCBkYXRhOiBhbnkgPSBudWxsKTogSHR0cFJlc3BvbnNlIHtcbiAgICBpZiAoc3RhdHVzQ29kZSA8IDEwMCB8fCBzdGF0dXNDb2RlID4gNTk5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3N0YXR1cyBjb2RlIG91dCBvZiByYW5nZScpXG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2U6IEh0dHBSZXNwb25zZSA9IHtcbiAgICAgIHN0YXR1c0NvZGUsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKicsXG4gICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFscyc6IHRydWUsXG4gICAgICB9LFxuICAgIH1cblxuICAgIGlmICh0aGlzLmhlYWRlcnMpIHtcbiAgICAgIGlmICh0aGlzLmhlYWRlcnMuYWxsb3dPcmlnaW4pIHJlc3BvbnNlLmhlYWRlcnNbJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbiddID0gdGhpcy5oZWFkZXJzLmFsbG93T3JpZ2luXG4gICAgICBpZiAodGhpcy5oZWFkZXJzLmFsbG93TWV0aG9kcykgcmVzcG9uc2UuaGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyddID0gdGhpcy5oZWFkZXJzLmFsbG93TWV0aG9kc1xuICAgIH0gXG5cbiAgICBzd2l0Y2ggKHRoaXMuZm9ybWF0dGVyKSB7XG4gICAgICBjYXNlICdKU09OJzpcbiAgICAgICAgcmVzcG9uc2UuYm9keSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpXG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXNwb25zZS5ib2R5ID0gZGF0YVxuICAgIH1cblxuICAgIHJldHVybiByZXNwb25zZVxuICB9XG59XG5cbmV4cG9ydCB0eXBlIEh0dHBSZXNwb25zZSA9IHtcbiAgYm9keT86IHN0cmluZ1xuICBzdGF0dXNDb2RlOiBudW1iZXJcbiAgaGVhZGVyczogUmVjb3JkPHN0cmluZywgdW5rbm93bj5cbn1cblxuZXhwb3J0IGVudW0gUmVzcG9uc2VGb3JtYXR0ZXJzIHtcbiAgJ0pTT04nID0gJ0pTT04nLFxufVxuXG5leHBvcnQgZW51bSBSZXNwb25zZUNvZGVzIHtcbiAgJ0JBRF9SRVFVRVNUJyA9IDQwMCxcbiAgJ1VOQVVUSE9SSVNFRCcgPSA0MDEsXG4gICdPSycgPSAyMDAsXG4gICdTRVJWRVJfRVJST1InID0gNTAwLFxufVxuXG5leHBvcnQgZW51bSBSZXNwb25zZVR5cGVzIHtcbiAgJ1BPU1QnID0gJ3Bvc3QnLFxuICAnR0VUJyA9ICdnZXQnLFxufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./platform-service/utils/response.util.ts\n");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./platform-service/api/auth.ts");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;