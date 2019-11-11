var $ = global.jQuery;

module.exports = ExampleModule;

function ExampleModule() {
    if (!(this instanceof ExampleModule)) {
        return new ExampleModule();
    }

    console.log('ExampleModule initialized.');

    // Script goes here

}
