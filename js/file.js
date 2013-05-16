/*
* ===========================================================================
* 
* Wolf3D Browser Version GPL Source Code
* Copyright (C) 2012 id Software LLC, a ZeniMax Media company. 
* 
* This file is part of the Wolf3D Browser Version GPL Source Code ("Wolf3D Browser Source Code").  
* 
* Wolf3D Browser Source Code is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 2 of the License, or
* (at your option) any later version.
* 
* Wolf3D Browser Source Code is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* 
* You should have received a copy of the GNU General Public License version 2
* along with Wolf3D Browser Source Code.  If not, see <http://www.gnu.org/licenses/>.
* 
* If you have questions concerning this license, you may contact in writing id Software LLC, c/o ZeniMax Media Inc., Suite 120, Rockville, Maryland 20850 USA.
* 
* ===========================================================================
*/

 
/** 
 * @namespace 
 * @description Binary file reading
 */
Wolf.File = (function() {

    
    /**
     * @description Open a file from URL 
     * @memberOf Wolf.File
     * @param {string} url The URL to open
     * @param {function} callback Is called when file has been loaded. Second argument is file obj.
     */
    function openURL(url, callback) {
        var xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 0) {
                    callback(null, {
                        data : xhr.responseText,
                        size : xhr.responseText.length,
                        position : 0
                    });
                } else {
                    callback(new Error("Server returned HTTP status: " + xhr.status));
                }
            }
        }
        xhr.open("GET", url, true);
        xhr.overrideMimeType('text/plain; charset=x-user-defined');
        xhr.send(null);
    }
    
	
	function atob(str) {
		str = str.replace(/=+$/, "");
		var b64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
			a, b, c, b1, b2, b3, b4, 
			chr = String.fromCharCode,
			out = [];
		for (var i=0,len=str.length;i<len;) {
			b1 = b64chars.indexOf(str.charAt(i++));
			b2 = b64chars.indexOf(str.charAt(i++));
			b3 = b64chars.indexOf(str.charAt(i++));
			b4 = b64chars.indexOf(str.charAt(i++));

			a = ((b1 & 0x3F) << 2) | ((b2 >> 4) & 0x3);
			b = ((b2 & 0xF) << 4) | ((b3 >> 2) & 0xF);
			c = ((b3 & 0x3) << 6) | (b4 & 0x3F);

			out.push(chr(a), chr(b), chr(c));
		}
		return out.join("");
	}
	
    /**
     * @description Open a file from base64 filetable
     * @memberOf Wolf.File
     * @param {string} filename The name of the file to open
     * @param {object} files The filetable
     * @param {function} callback Is called when file has been loaded. Second argument is file obj.
     */
    function open(filename, files, callback) {
        var b64data = files[filename];
        if (b64data) {
            var data = atob(b64data);
            callback(null, {
                data : data,
                size : data.length,
                position : 0
            });
        } else {
            callback(new Error("File not found: " + filename));
        }
    }

    /**
     * @description Read an unsigned 8-bit integer from a file and advance the file position.
     * @memberOf Wolf.File
     * @param {object} f The file
     * @returns {number} 
     */
    function readUInt8(f) {
        var b = f.data.charCodeAt(f.position) & 0xFF
        f.position++;
        return b;
    }

    /**
     * @description Read a signed 8-bit integer from a file and advance the file position.
     * @memberOf Wolf.File
     * @param {object} f The file
     * @returns {number} 
     */
    function readInt8(f) {
        var v = readUInt8(f);
        return v > 127 ? v - 256 : v;
    }

    /**
     * @description Read an unsigned 16-bit integer from a file and advance the file position.
     * @memberOf Wolf.File
     * @param {object} f The file
     * @returns {number} 
     */
	function readUInt16(f) {
		var v = readUInt8(f) + (readUInt8(f) << 8);
		return (v < 0) ? v + 0x10000 : v;
	}
    
    /**
     * @description Read a signed 16-bit integer from a file and advance the file position.
     * @memberOf Wolf.File
     * @param {object} f The file
     * @returns {number} 
     */
	function readInt16(f) {
		var v = readUInt16(f);
        return (v > 0x7fff) ? v - 0x10000 : v;
	}
    
    /**
     * @description Read an unsigned 32-bit integer from a file and advance the file position.
     * @memberOf Wolf.File
     * @param {object} f The file
     * @returns {number} 
     */
	function readUInt32(f) {
        var b0 = readUInt8(f),
            b1 = readUInt8(f),
            b2 = readUInt8(f),
            b3 = readUInt8(f),
            v = ((((b3 << 8) + b2) << 8) + b1 << 8) + b0;
		return (v < 0) ? v + 0x100000000 : v;
	}
    
    /**
     * @description Read a signed 32-bit int from a file and advance the file position.
     * @memberOf Wolf.File
     * @param {object} f The file
     * @returns {number} 
     */
	function readInt32(f) {
		var v = readUInt32(f);
        return (v > 0x7fffffff) ? v - 0x100000000 : v;
	}
    
    /**
     * @description Read a string from a file and advance the file position.
     * @memberOf Wolf.File
     * @param {object} f The file
     * @param {number} length The length of the string
     * @returns {string} 
     */
    function readString(f, length) {
        var str = f.data.substr(f.position, length);
        f.position += length;
        return str;
    }
    
    /**
     * @description Read an array of bytes a file and advance the file position.
     * @memberOf Wolf.File
     * @param {object} f The file
     * @param {number} num The number of bytes to read
     * @returns {array} 
     */
    function readBytes(f, num) {
        var b = [];
        for (var i=0;i<num;i++) {
            b[i] = f.data.charCodeAt(f.position+i) & 0xFF;
        }
        f.position += num;
        return b;
    }

    return {
        open : open,
        readInt8 : readInt8,
        readUInt8 : readUInt8,
        readInt16 : readInt16,
        readUInt16 : readUInt16,
        readInt32 : readInt32,
        readUInt32 : readUInt32,
        readBytes : readBytes,
        readString : readString
    };

})();
