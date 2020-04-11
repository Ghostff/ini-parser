# .INI Parser
Converts an .ini file/string to javascript object. Supports section processing and typed value scan.
## Installation
```bash
npm i @ghostff/ini_parser
```

## Method Synopsis
```js
parse      (ini_string_or_filepath, callback, process_sections = true, scan = false)
parseSync  (ini_string_or_filepath, process_sections = true, scan = false)
parseString(ini_string, process_sections = true, scan = false)
```

## Usage
##### Node
```js
var iniParser = require('@ghostff/ini_parser');

// Async
iniParser.parse('./example.ini', function(err, data) {
    console.log(data);
});

// Sync
var data = iniParser.parseSync('./config.ini');

// String
var data = iniParser.parseString("name=foo bar");
```
##### Regular JS
```js
var iniParser = require('@ghostff/ini_parser');

var data = iniParser.parse('' +
  '; example.ini\n' +
  'name=foo bar\n' +
  'age=33\n' +
  'single=false'
);
```

## Demo
  - **process_sections:** By setting the `process_sections` parameter to `TRUE`, you get a nested object,
   with the section names and settings included. The default for `process_sections` is `FALSE`.
 - **scan:**  When `scan` is set to `TRUE`, ini property value will be parsed. The default for `scan` is (`FALSE`).
 
```ini
; example.ini
name=foo bar
datails[age] = 30
datails[single] = true

[db]
user=foo
pass=null

[app]
site_name=foobar
```
```js
iniParser.parseSync('./example.ini');
iniParser.parseSync('./example.ini', true); // process sections.
iniParser.parseSync('./example.ini', true, true); // process sections and use typed scan.
```
Result
```js
{
  name: 'foo bar',
  datails: { age: '30', single: 'true' },
  user: 'foo',
  pass: 'null',
  site_name: 'foobar'
}

{
  name: 'foo bar',
  datails: { age: '30', single: 'true' },
  db: { user: 'foo', pass: 'null' },
  app: { site_name: 'foobar' }
}

{
  name: 'foo bar',
  datails: { age: 30, single: true },
  db: { user: 'foo', pass: null },
  app: { site_name: 'foobar' }
}

```
