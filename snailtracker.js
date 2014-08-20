var SnailTracker = Object.create({
    api_key: null,
    api_url: null,
    url: function(uri){
        return [this.api_url, uri].join("/");
    },
    initialize: function(){
        var _this = this;
        // TODO: Let's catch an event when the session ID is complete, then setup the tracking
        this.session.initialize(this);
        this.actions.initialize(this);
        // Session is ready, let's start watching for events!
        $('body').on('click focus blur', function(ev){
            _this.actions.create(ev, $(ev.target));
        });
        $('body').on('change', ':input', function(ev){
            _this.actions.create(ev, $(ev.target));
        });
    },
    cookies: {
        session: 'snailtracker-session'
    }
});

SnailTracker.actions = Object.create({
    snailtracker: null,
    initialize: function(snailtracker){
        this.snailtracker = snailtracker;
    },
    create: function(event, $target){
        var selector = $target.getSelector();
        var type     = event.type;
        var text     = $target.text();
        var _this = this;

        var app_action_data = {
            session_api_key: _this.snailtracker.session.id,
            url: window.location.origin,
            keycode: event.keyCode,
            action_type_name: type,
            target_text: text,
            target_value: $(event.target).secure_val(),
            selector: selector,
            char: null
        };

        if($.inArray(event.type, ["keyup", "keydown"])){
            app_action_data.char = String.fromCharCode(event.which);
        }

        // TODO: cache locally for a while before sending up to reduce the number of requests.
        $.post(this.snailtracker.url("actions"), $.param({
            api_key: _this.snailtracker.api_key,
            app_action: app_action_data
        }));
    }
});

SnailTracker.session = Object.create({
    snailtracker: null,
    id: null,
    create: function(){
        var _this = this;
        $.post(this.snailtracker.url("sessions"), $.param({
            api_key: _this.snailtracker.api_key,
            session: {
                user_id: _this.snailtracker.user_id,
                user_name: _this.snailtracker.user_name,
                email: _this.snailtracker.email
            }
        }), function(response){
            _this.id = response["session"]["api_key"];
            _this.set_cookie();
        });
    },
    set_cookie: function(){
        $.cookie(this.snailtracker.cookies.session, this.id, {expires: 1});
    },
    initialize: function(snailtracker){
        // TODO: Expire the session after a certain amount of time
        this.snailtracker = snailtracker;
        if( $.cookie(this.snailtracker.cookies.session)){
            this.id = $.cookie(this.snailtracker.cookies.session);
            // Update the cookie to keep the session alive.
            this.set_cookie();
        } else {
            this.create();
        }
    }
});

$.fn.secure_val = function(){
    var replacement = "XXXXXX";
    var value = this.val();
    var value_numbers_only = value.replace(/[^0-9]/g, '');
    // Obfuscate CC numbers
    if( value_numbers_only.length >= 12 && value_numbers_only.length <= 20 ){
        return replacement;
    }
    // Obfuscate passwords
    if( this.attr('type') == "password" ){
        return replacement;
    }
    return value;
}

