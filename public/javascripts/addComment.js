let url = 'http://localhost:3000/ticket/comment/';

function createOneRegister(ticketId, data) {
  return $.ajax({
    url: `${url}${ticketId}`,
    method: 'POST',
    data: data,
  });
}

function listCommentsOfTicket(ticketId) {
  return $.ajax({
    url: `${url}${ticketId}`,
    method: 'GET',
    dataType: 'json'
  });
}
$(document).ready(function() {

  const ticketId = $('#ticketId').html();

  $('#comment-list').on('click', (event) => {
    event.preventDefault();
    listCommentsOfTicket(ticketId).then( comments => {
      console.log('COmmentttsssssss ', comments);
      s('.comment').append('<p>' + comments + '</p>');
    });
  });


  $('#comment-form').on('submit', (event) => {
    event.preventDefault();

    // get data
    const commentInfo = {
      content: $('#content').val(),
      image: $('#image').val(),
    };
    createOneRegister(ticketId, commentInfo).then(newComm => {
      console.log('New comment created: ', newComm);
      $('#content').val('');
      $('#image').val('');
    }, (err, data) => {
      console.log('ERROR', err, 'data: ', data);
    });

  });
});
