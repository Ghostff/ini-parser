try {
    
   /*
    * get the file handler
    */
    var fs = require('fs');

    /*
     * parses a .ini file.
     * @param: {String} file, the location of the .ini file
     * @param: {Function} callback, the function that will be called when parsing is done
     * @return: none
     */
    module.exports.parse = function (file, callback, process_sections = false, scan = false) {
        if (!callback) {
            return;
        }
        
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                callback(err);
            } else {
                callback(null, parse(data, process_sections, scan));
            }
        });
    };
    
    module.exports.parseSync = function (file, process_sections = false, scan = false) {
        return parse(fs.readFileSync(file, 'utf8'), process_sections, scan);
    };
}
catch (e) {
    // When fs is not found, parse/parseSync would accept string instead of file path.
    module.exports.parse       = parse;
    module.exports.parseSync   = parse;
}

module.exports.parseString = parse;

/**
 * Parses property value.
 *
 * @param {string}  value   The value to parse.
 * @param {boolean} scan    If true, then option values will not be parsed.
 * @returns {number|boolean|null|float|string}
 */
function parseValue(value, scan) {
    if (scan && value !== "") {
        var matches = null;
        if ((matches = value.match(/^"(.*)"$/)) !== null) {
            return matches[1];
        } else if (!isNaN(matches = Number(value))) {
            return matches;
        } else if ((matches = value.toLowerCase()) === 'true') {
            return true;
        } else if (matches === 'false') {
            return false;
        } else if (matches === 'null') {
            return null;
        }
    }

    return value;
}

/**
 * Parses an ini formatted string to object.
 *
 * @param {string} data                 The contents of the ini file being parsed.
 * @param {boolean} process_sections    By setting the process_sections parameter to TRUE, you get a nested object,
 *            with the section names and settings included. The default for process_sections is FALSE
 * @param {boolean} scan                If true, then option values will not be parsed.
 * @returns {Object} parsed ini string.
 */
function parse(data, process_sections, scan) {
    var match = null;
    var section = null;
    var props = {};
    data.split(/\r\n|\r|\n/).forEach(function (line) {
        // If not comment
        if (! /^\s*;.*$/.test(line)) {
            // Creates section if eligible.
            if (process_sections && (match = line.match(/^\s*\[\s*([^\]]*)\s*\]\s*$/)) !== null) {
                section = match[1];
                props[section] = {};
            }
            if ((match = line.match(/^\s*([\w\.\-\_]+)(\s*\[(.*?)\])?\s*=\s*(.*?)\s*$/)) !== null) {
                [, name, , index, value] = match;
                var tmpProps = section ? props[section] : props;
                if (index !== undefined) {
                    if (! tmpProps.hasOwnProperty(name)) {
                        tmpProps[name] = {};
                    }
                    // Convert empyt indexes e.g("") to integer.
                    index = (index === "") ? Object.keys(tmpProps[name]).filter(function (attr) {
                        return ! isNaN(parseInt(attr))
                    }).length : index;

                    tmpProps[name][index] = parseValue(value, scan);
                } else  {
                    tmpProps[name] = parseValue(value, scan);
                }
            }
        }
    });
    
    return props;
}
