// Initialise the Zendesk JavaScript API client
    // https://developer.zendesk.com/apps/docs/apps-v2
    var client = getClient();



    function init() {
      client.get('ticket.customField:custom_field').then(function(data) {
        var requirement = data['ticket.customField:custom_field'];

        if (!requirement) {
          renderText('Error: Could not find `requirement:ticket_custom_field`, have you added the field to your ticket form?');
          return;
        }

        var customFieldPath = 'custom_field_' + requirement.requirement_id;
        // set the text to the current value
        client.get('ticket.customField:' + customFieldPath).then(function(data) {
          var fieldValue = data['ticket.customField:' + customFieldPath];
          renderText('Requirement field value: ' + fieldValue);
        });

        // update text whenever the value changes
        client.on('ticket.' + customFieldPath + '.changed', function(fieldValue) {
          renderText('Requirement field value: ' + fieldValue);
        });
      });
    }

    client.on('app.registered', function() {
      client.invoke('resize', { width: '100%', height: '80px' });
      init();
    });


    function renderText(text) {
        var mainSectionEl = document.querySelector('section[data-main]');
        mainSectionEl.innerText = text;
      }