
$(document).ready(function() {

    getData();

    $("form").submit(function(e) {
        e.preventDefault();
        postData()
    });


});


var postData = function() {

  var data = {
      name: $("#name").val(),
      favorite_city: $("#city").val()
  }

  $.post("https://spotify-test-mg.herokuapp.com/people", data)
    .then(successCallback, errorCallback)

  function errorCallback(){
    alert("POST request failed!")
  }

  function successCallback(data, status) {
    console.log(`added ${data.name} with favorite city ${data.favorite_city}`);
    $("ul.people-list").append(`<li data-id=${data.id}>
              <span class="id">${data.id}</span>
              <span class="name">${data.name}</span>
              <span class="location">${data.favorite_city}</span>
              <span class="delete"><a id="delete" onClick="deleteData(${data.id});" href="javascript:void(0)">Delete</a></span>
              <span class="edit"><a id="edit" onClick="editData(${data.id});" href="javascript:void(0)">Edit</a></span>
            </li>`);
  }
}

var getData = function() {

  $.get("https://spotify-test-mg.herokuapp.com/people")
    .then(successCallback, errorCallback)

  function successCallback(data, status) {
      var people = data.map(function(el) {

        return `<li data-id=${el.id}>
                  <span class="id">${el.id}</span>
                  <span class="name">${el.name}</span>
                  <span class="location">${el.favorite_city}</span>
                  <span class="delete"><a id="delete" onClick="deleteData(${el.id});" href="javascript:void(0)">Delete</a></span>
                  <span class="edit"><a id="edit" onClick="editData(${el.id});" href="javascript:void(0)">Edit</a></span>
                </li>`
      })

      $("ul.people-list").children(':not(.table-header)').remove()

      people.forEach(function(el) {
        $("ul.people-list").append(el)
      })
  }

  function errorCallback() {
    alert("GET request failed!")
  }
}

var editData = function(id) {
  console.log("editData")
  $.get(`https://spotify-test-mg.herokuapp.com/people/${id}`)
    .then(successCallback, errorCallback)

  function successCallback(data, status) {

    $(".edit-form").remove();

    $("body").append(
      `<div class="edit-form">
        <div class="close">Close</div>
        <form class="edit" action="index.html" method="post">
          <input type="hidden" name="_method" value="put">
          <input class="name" type="text" name="name" value=${data.name}>
          <input class="city" type="text" name="favorite_city" value=${data.favorite_city}>
          <input class="button" type="submit" name="submit" value="Submit">
        </form>
      </div>`
    );

    $(".edit-form").submit(function(e) {
        e.preventDefault();

        data = {
          name: $(".edit-form .name").val(),
          favorite_city: $(".edit-form .city").val()
        }

        $.ajax({
          url: `https://spotify-test-mg.herokuapp.com/people/${id}`,
          type: "PUT",
          data: data
        })
        .then(successCallback, errorCallback)

        function successCallback() {
          var $name = $(`ul.people-list li[data-id=${id}] span.name`);
          var $location = $(`ul.people-list li[data-id=${id}] span.location`);

          $name.text(data.name);
          $location.text(data.favorite_city);


        }

        function errorCallback() {
          console.log("failed to update entry");
        }


    });

    $(".edit-form .close").click(function(){
      $(this).parent().remove();
    })


  }

  function errorCallback() {
    alert("PUT request failed!")
  }
}

var deleteData = function(id) {

  console.log(`deleting person with id ${id}`);

  $.ajax({
    url: `https://spotify-test-mg.herokuapp.com/people/${id}`,
    type: "DELETE"
  })
    .then(successCallback, errorCallback)

  function successCallback(data, status) {
    $("ul.people-list").children(`li[data-id=${id}]`).remove()
  }

  function errorCallback(){
    alert("GET request failed!")
  }
}
