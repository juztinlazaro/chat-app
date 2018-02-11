var expect = require('expect');

var { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'justin';
    var text = 'hey sup';
    var message = generateMessage(from, text);
    expect(message.from).toBe(from);
    expect(message.text).toBe(text);
    expect(message.createAt).toBeA('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    var from = 'justin';
    var lon = 312312;
    var lng = 321312;
    var message = generateLocationMessage(from, lon, lng);
    expect(message.from).toBe(from);
    expect(message.url).toBe(`https://www.google.com/maps?q=${lon},${lng}`);
    expect(message.createAt).toBeA('number');
  });
});
