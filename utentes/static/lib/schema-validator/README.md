# schema-validator

A plugable utility to help in validating content in plain JavaScript.

## How to use it

Create a schema that defines the rules:

    var mySchema = [{
        'fieldname': 'myID',
        'message':   'ID cannot be void',
        'rules':     ['NOT_NULL']
    }, {
        'fieldname': 'myDate',
        'message':   'myDate is not a Date instance',
        'rules':     ['IS_DATE']
    }];

Validate an object :

    var myBareObject = {
        'myID':   '2016-001',
        'myDate': 'not a Date object instance'
    };
    var myValidator = validator(mySchema);
    var myMessages = myValidator.validate(myBareObject);

myMessages is an array containing the messages for the rules that fail.

## How to create custom rules

The current generic rules the validator supports are:

-   NOT_NULL
-   IS_DATE
-   IS_NUMERIC
-   INT_LESS_THAN_8
-   IS_BOOLEAN
-   ARRAY_NOT_VOID

But you can plug your own, like this:

    var mySchema = [{
        'fieldname': 'myID',
        'message':   'ID cannot be void',
        'rules':     ['NOT_NULL']
    }, {
        'fieldname': 'myID',
        'message':   'ID has not the proper format',
        'rules':     ['MY_CUSTOM_FORMAT']
    }, {
        'fieldname': 'myDate',
        'message':   'myDate is not a Date instance',
        'rules':     ['IS_DATE']
    }];
    var myBareObject = {
        'myID':   '2016-001',
        'myDate': 'not a Date object instance'
    };
    var myValidator = validator(mySchema);
    // Plug MY_CUSTOM_FORMAT in, so it is available to the validator
    myValidator.addRule('MY_CUSTOM_FORMAT', {
        fails: function(value) {
            var re = /^\d{4}-\d{3}$/;
            return (value && (! re.test(value)));
        }
    });
    var messages = myValidator.validate(myBareObject);
