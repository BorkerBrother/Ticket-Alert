(function () {
    var client = ZAFClient.init();

    client.invoke('resize', { width: '200px', height: '200px' });

    client.get('ticket.requester.id').then(
        function(data) {
          var user_id = data['ticket.requester.id'];
          requestUserInfo(client, user_id);
        }
      );


  })();

  

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

