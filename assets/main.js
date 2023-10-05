

(function () {
  // Import Zendesk SDK
  // get() - read
  // set() - write
  // on() - listen
  // request - Http Request 
    var client = ZAFClient.init();

    // Size from App
    client.invoke('resize', { width: '200px', height: '200px' });

    // Get USER INFO 
    client.get('ticket.requester.id').then(
        function(data) {
          var user_id = data['ticket.requester.id'];
          requestUserInfo(client, user_id);
        }
      );


    // GET TICKET INFO
    client.get('/api/v2/tickets.json').then(
      function(tickets) {
        console.log(tickets);
      },
      function(response) {
        console.error(response.responseText);
      }
    );

    // Get Ticket Info 
    client.get('tickets.customField:Enddatum').then(function(data2) {
      var ticket_endDate = data2['tickets.customField:Enddatum'];
      requestTicketInfo(client, ticket_endDate);
    });

  })();

  
///// GET TICKET INFO 
function requestTicketInfo(client, id) {

  var settings = {
    url: '/api/v2/tickets/' + id + '.json',
    type:'GET',
    dataType: 'json',
  };

  client.request(settings).then(
    function(data) {
      showInfo(data);
    },
    function(response) {
      showError(response);
    }
  );
}
///// GET USER INFO
  function requestUserInfo(client, id) {

    var settings = {
      url: '/api/v2/users/' + id + '.json',
      type:'GET',
      dataType: 'json',
    };
  
    client.request(settings).then(
      function(data) {
        showInfo(data);
        console.log(data);
      },
      function(response) {
        showError(response);
      }
    );
  }
  

// Show 
  function showInfo(data) {
    var requester_data = {
      'name': data.user.name,
      'tags': data.user.tags,
      'created_at': formatDate(data.user.created_at),
      'finish_at': formatDate(data.user.finish_at)
    };
  
    var source = document.getElementById("requester-template").innerHTML;
    var template = Handlebars.compile(source);
    var html = template(requester_data);
    document.getElementById("content").innerHTML = html;
  }

  function showError() {
    var error_data = {
      'status': 404,
      'statusText': 'Not found'
    };
  
    var source = document.getElementById("error-template").innerHTML;
    var template = Handlebars.compile(source);
    var html = template(error_data);
    document.getElementById("content").innerHTML = html;
  }




function formatDate(date) {
    var cdate = new Date(date);
    var options = {
      year: "numeric",
      month: "short",
      day: "numeric"
    };
    date = cdate.toLocaleDateString("en-us", options);
    return date;
  }

