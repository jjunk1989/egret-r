// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

namespace egret.web {

    /**
     * @private
     */
    export class WebCapability {
        /**
         * @private
         * 检测系统属性
         */
        public static detect(): void {
            let capabilities = egret.Capabilities;
            let ua = navigator.userAgent.toLowerCase();
            capabilities["isMobile" + ""] = (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
            if (capabilities.isMobile) {
                if (ua.indexOf("windows") < 0 && (ua.indexOf("iphone") != -1 || ua.indexOf("ipad") != -1 || ua.indexOf("ipod") != -1)) {
                    capabilities["os" + ""] = "iOS";
                }else if (ua.indexOf("android") != -1 && ua.indexOf("linux") != -1) {
                    capabilities["os" + ""] = "Android";
                }
                else if (ua.indexOf("windows") != -1) {
                    capabilities["os" + ""] = "Windows Phone";
                }
            }
            else {
                if (ua.indexOf("windows nt") != -1) {
                    capabilities["os" + ""] = "Windows PC";
                }else if(navigator.platform == "MacIntel" && navigator.maxTouchPoints > 1){//ios 13 Request Desktop Website
                    capabilities["os" + ""] = "iOS";
                    capabilities["isMobile" + ""] = true;
                }else if (ua.indexOf("mac os") != -1) {
                    capabilities["os" + ""] = "Mac OS";
                }
            }

            let language = (navigator.language || navigator["browserLanguage"]).toLowerCase();
            let strings = language.split("-");
            if (strings.length > 1) {
                strings[1] = strings[1].toUpperCase();
            }
            capabilities["language" + ""] = strings.join("-");

            WebCapability.injectUIntFixOnIE9();
        }

        public static injectUIntFixOnIE9() {
            if (/msie 9.0/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
                let IEBinaryToArray_ByteStr_Script =
                    "<!-- IEBinaryToArray_ByteStr -->\r\n" +
                    "<script type='text/vbscript' language='VBScript'>\r\n" +
                    "Function IEBinaryToArray_ByteStr(Binary)\r\n" +
                    "   IEBinaryToArray_ByteStr = CStr(Binary)\r\n" +
                    "End Function\r\n" +
                    "Function IEBinaryToArray_ByteStr_Last(Binary)\r\n" +
                    "   Dim lastIndex\r\n" +
                    "   lastIndex = LenB(Binary)\r\n" +
                    "   if lastIndex mod 2 Then\r\n" +
                    "       IEBinaryToArray_ByteStr_Last = Chr( AscB( MidB( Binary, lastIndex, 1 ) ) )\r\n" +
                    "   Else\r\n" +
                    "       IEBinaryToArray_ByteStr_Last = " + '""' + "\r\n" +
                    "   End If\r\n" +
                    "End Function\r\n" + "<\/script>\r\n" +
                    "<!-- convertResponseBodyToText -->\r\n" +
                    "<script>\r\n" +
                    "let convertResponseBodyToText = function (binary) {\r\n" +
                    "   let byteMapping = {};\r\n" +
                    "   for ( let i = 0; i < 256; i++ ) {\r\n" +
                    "       for ( let j = 0; j < 256; j++ ) {\r\n" +
                    "           byteMapping[ String.fromCharCode( i + j * 256 ) ] =\r\n" +
                    "           String.fromCharCode(i) + String.fromCharCode(j);\r\n" +
                    "       }\r\n" +
                    "   }\r\n" +
                    "   let rawBytes = IEBinaryToArray_ByteStr(binary);\r\n" +
                    "   let lastChr = IEBinaryToArray_ByteStr_Last(binary);\r\n" +
                    "   return rawBytes.replace(/[\\s\\S]/g," +
                    "                           function( match ) { return byteMapping[match]; }) + lastChr;\r\n" +
                    "};\r\n" +
                    "<\/script>\r\n";
                document.write(IEBinaryToArray_ByteStr_Script);
            }
        }
    }
    WebCapability.detect();
}
