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

// Print character list fetch all
function printCommentsList(commentsList) {
  let container = $('#comments-container');
  container.children().remove(); // Delete all containers with char info

  commentsList.forEach(comment => {
    let cont = `<div class="row">
        <div class="col-xs-12 col-md-8 col-md-offset-2">
            <div class="panel panel-white post panel-shadow">
                <div class="post-heading">
                    <div class="pull-left image">
                        <img src="${ comment.creatorCommentId.imgAvatar }" alt="${ comment.creatorCommentId.imgAvatar }" class="img-circle avatar" alt="user profile image">
                    </div>
                    <div class="pull-left meta">
                        <div class="title h5">
                            <a href="#"><b>${ comment.creatorCommentId.username }</b></a>
                            posted a question
                        </div>
                        <h6 class="text-muted time">Created:${ comment.created_at }</h6>
                    </div>
                </div>
                <div class="post-description">
                    <p>${ comment.content }</p>
                </div>
            </div>
        </div>
    </div>`;
    container.append(cont);
  });
}


$(document).ready(function() {

  const ticketId = $('#ticketId').html();

  // LIST COMMENTS
  $('#comment-list').on('click', (event) => {
    event.preventDefault();
    listCommentsOfTicket(ticketId).then(comments => {
      console.log('Comments object:', comments);
      printCommentsList(comments);
    });
  });

  // ADD NEW COMMENT
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
