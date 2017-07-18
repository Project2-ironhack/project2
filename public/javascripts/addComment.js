function createOneRegister(ticketId, data) {
  var url = `http://localhost:3000/ticket/comment/${ticketId}`;
  console.log('URL',url);
  return $.ajax({
    url: url,
    method: 'POST',
    data: data,
  });
}

$(document).ready(function() {

  $('#comment-form').on('submit', (event) => {
    event.preventDefault();

    // get data
    const ticketId = $('#ticketId').html();
    const commentInfo = {
      content: $('#content').val(),
      image: $('#image').val(),
    };
    createOneRegister(ticketId, commentInfo).then( newComm => {
      console.log('New comment created: ', newComm);
      $('#content').val('');
      $('#image').val('');
    }, (err, data) => {
      console.log('ERROR', err, 'data: ', data);
    });

  });
});
