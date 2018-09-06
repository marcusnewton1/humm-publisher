// =============================================================================
// Drafts Controller
// =============================================================================

// Load the posts
// =============================================================================

// This callback loads at the very beggining in order to load the default values
GetPosts("draft", function(obj) {

  if(obj.length === 0)
  return;

  //Sort Timestamps by Newest
  obj = obj.sort(function(a,b){
    caseA = new Date(a.timestamp)
    caseB = new Date(b.timestamp)
    return caseA < caseB
  })

  // Populate the sidebar
  var postSidebar = obj.map((post, index) => {
    if (index == 0) {
      return `<a id="${post.hash}" href="#"
                class="list-group-item list-group-item-action align-items-start active">
                  <h5 class="mb-1">${post.title}</h5><small>${moment(post.timestamp).format('MMMM D, YYYY [at] h:mm A z')}</small>
              </a>`;
    } else {
      return `<a id="${post.hash}" href="#"
                class="list-group-item list-group-item-action align-items-start">
                  <h5 class="mb-1">${post.title}</h5><small>${moment(post.timestamp).format('MMMM D, YYYY [at] h:mm A z')}</small>
              </a>`;
    }
  }).join('');

  /* Since the first option is going to be the one shown by default,
  we grab this one.*/
  var postTitle = obj[0].title;
  var postBody = obj[0].content;

  // Append the content to the Sidebar and Content
  document.getElementById('post-list').insertAdjacentHTML('beforeend', postSidebar)
  document.getElementById('thePost-title').innerHTML = postTitle;
  document.getElementById('thePost-body').innerHTML = postBody;

  /* This variable is going to hold the dynamic elements inserted in the sidebar
   in order to attach the addEventListener to each one*/
  var postsItems = document.getElementsByClassName("list-group-item");

  /* Attaching the addEventListener here allow us to append it to every element
  in the sidebar.*/
  Array.from(postsItems).forEach(function(element) {
    element.addEventListener('click', RefreshDrafts);
  });
})

/*
The primary purpose of this function is to load a new draft upon clicking one of
the elements in the sidebar
*/
function RefreshDrafts(event) {
  GetPosts("draft",function(obj) {

    var postContent = obj.filter(val => {
      return val.hash === this.getAttribute('id');
    });

    var removeActiveElement = document.querySelector(".list-group-item.active");
    removeActiveElement.classList.remove("active");

    var getActiveElement = document.getElementById(this.getAttribute('id'))
    getActiveElement.classList.add("active");

    document.getElementById('thePost-title').innerHTML = postContent[0].title;
    document.getElementById('thePost-body').innerHTML = postContent[0].content;

  }.bind(this));
}

/*
Delete Draft
*/

function RemoveDraft() {
  var activeDraft = document.querySelector(".list-group-item.active").getAttribute('id')
  DeletePost({hash : activeDraft, message : "deleted", type: "draft"})
  setTimeout(function(){
  location.reload()},'30')
}

/*
Edit Draft
*/

function EditDraft() {
 var activeDraft = document.querySelector(".list-group-item.active").getAttribute('id')
 window.location = '/posts/post-editor.html?entry=' + encodeURI(activeDraft);
}
