var assert = require('assert').strict,
	iniParser = require('../lib/ini-parser'),
	initFilePath = __dirname + '/files/test.ini';

it('async read file', function(){
	iniParser.parse(initFilePath, function(err, ini){
		assert.equal(err, null);
	});
});

it('async read non-existing file', function(){
	iniParser.parse('./files/doesnotexists.ini', function(err, ini){
		assert.equal(err.code, 'ENOENT');
		assert.equal(ini, undefined);
	});
});

it('sync read file', function(){
	var ini = iniParser.parseSync(initFilePath);
	assert.notEqual(ini, null);
});

it('sync read non-existing file', function(){
	assert.throws(function(){
		var ini = iniParser.parseSync('./files/doesnotexists.ini');
	});
});

it('async read file and look for variable', function(){
	iniParser.parse(initFilePath, function(err, ini){
		assert.equal(err, null);
		assert.equal(ini.foo, 'bar');
	});
});

it('comments are ignored', function() {
	iniParser.parse(initFilePath, function(err, ini) {
		assert.equal(ini.test, undefined);
		assert.equal(ini.anotherComment, undefined);
	});
});

it('variables are not grouped by default', function() {
	iniParser.parse(initFilePath, function(err, ini) {
		assert.equal(ini.missing, undefined);
		assert.equal(ini.foo, 'bar');
		assert.equal(ini.var_with_space_at_end, 'bar');
		assert.equal(ini.earth, 'awesome');
		assert.equal(ini['a.b'], 'c');
		assert.equal(ini.there_is, 'a space in here with = and trailing tab');
		assert.equal(ini.name, 'foo bar');
		assert.equal(ini.age, '33');
	});
});

it('variables are grouped when process_sections is true', function(){
	iniParser.parse(initFilePath, function(err, ini) {
		assert.equal(ini.missing, undefined);
		assert.equal(ini.foo, 'bar');
		assert.equal(ini.var_with_space_at_end, 'bar');
		assert.equal(ini.earth, undefined);
		assert.equal(ini.worlds.earth, 'awesome');
		assert.equal(ini['a.b'], undefined);
		assert.equal(ini.worlds['a.b'], 'c');
		assert.equal(ini.there_is, undefined);
		assert.equal(ini.section2.there_is, 'a space in here with = and trailing tab');
		assert.equal(ini.name, undefined);
		assert.equal(ini.Scan.name, 'foo bar');
		assert.equal(ini.age, undefined);
		assert.equal(ini.Scan.age, '33');
	}, true);
});

it('variables values are parsed when scan is true and process_sections is false', function(){
	iniParser.parse(initFilePath, function(err, ini) {
		assert.equal(ini.name, 'foo bar');
		assert.equal(ini.age, 33);
		assert.equal(ini.single, false);
	}, false, true);
});

it('variables values are parsed when scan and process_sections is true', function(){
	iniParser.parse(initFilePath, function(err, ini) {
		assert.equal(ini.Scan.name, 'foo bar');
		assert.equal(ini.Scan.age, 33);
		assert.equal(ini.Scan.single, false);
	}, true, true);
});

it('variables with squared bracket are treated as nested object', function() {
	iniParser.parse(initFilePath, function(err, ini) {
		assert.equal(ini.random['0'], '1');
		assert.equal(ini.random['1'], '2');
		assert.equal(ini.nested.foo, '43');
		assert.equal(ini.nested.fobar, 'null');
	});
});

it('variables with squared bracket are treated as nested object when process_sections is true', function() {
	iniParser.parse(initFilePath, function(err, ini) {
		assert.equal(ini.Nest.random['0'], '1');
		assert.equal(ini.Nest.random['1'], '2');
		assert.equal(ini['Another:Nest'].nested.foo, '43');
		assert.equal(ini['Another:Nest'].nested.fobar, 'null');
	}, true);
});

it('variables with squared bracket are treated as nested object and parsed when scan is true', function() {
	iniParser.parse(initFilePath, function(err, ini) {
		assert.equal(ini.random['0'], 1);
		assert.equal(ini.random['1'], 2);
		assert.equal(ini.nested.foo, 43);
		assert.equal(ini.nested.fobar, null);
	}, false, true);
});

it('data can be passed as string', function() {
	var iniString = "" +
	"[Nest]\n" +
	"random[] = 1\n" +
	"random[] = 2\n" +
	"\n" +
	"[Another:Nest]\n" +
	"nested[foo] = 43\n" +
	"nested[fobar] = null";

	it('variables with squared bracket are treated as nested object', function() {
		iniParser.parseString(iniString, function(err, ini) {
			assert.equal(ini.random['0'], '1');
			assert.equal(ini.random['1'], '2');
			assert.equal(ini.nested.foo, '43');
			assert.equal(ini.nested.fobar, 'null');
		});
	});

	it('variables with squared bracket are treated as nested object and parsed when scan is true', function() {
		iniParser.parseString(iniString, function(err, ini) {
			assert.equal(ini.random['0'], 1);
			assert.equal(ini.random['1'], 2);
			assert.equal(ini.nested.foo, 43);
			assert.equal(ini.nested.fobar, null);
		}, false, true);
	});
});
