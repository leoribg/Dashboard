$(function(){
  // Click event listener for add modal form submit button
  $("#submit-add-project").click(function() {
    // Create project JSON object
    var project = {};
    project.area = $('input[name="add-area"]').val();
    if (!project.area) {
      $('input[name="add-area"]').parent().addClass('has-error');
      event.preventDefault();
      return false;
    } else {
      $('input[name="add-area"]').parent().removeClass('has-error');
    }
    project.name = $('input[name="add-name"]').val();
    if (!project.name) {
      $('input[name="add-name"]').parent().addClass('has-error');
      event.preventDefault();
      return false;
    } else {
      $('input[name="add-name"]').parent().removeClass('has-error');
    }
    project.leader = $('input[name="add-leader"]').val();
    if (!project.leader) {
      $('input[name="add-leader"]').parent().addClass('has-error');
      event.preventDefault();
      return false;
    } else {
      $('input[name="add-leader"]').parent().removeClass('has-error');
    }
    project.date = $('input[name="add-date"]').val();
    project.members = $('input[name="add-members"]').val();
    project.goals = $('input[name="add-goals"]').val();
    project.software = $('input[name="add-software"]').val();
    project.effort = $('input[name="add-effort"]').val();
    var json = JSON.stringify(project);
    // console.log("Sending: " + json);
    $.ajax({
      type: "post",
      url: "/do/add",
      dataType: "json",
      data: json,
      contentType: "application/json",
      success: function(data){
        console.log("Receieved back from add request: " + JSON.stringify(data));
        $("#statusDisplay").html("<label class='label label-success'>Project Added</label>");
        $("#statusDisplay").removeClass("hide");
        $("#statusDisplay").fadeOut(5000);
        addToTable(data[0]);
        $("#modal-add-project").find("input[type=text]").val("");
      },
      failure: function(errMsg) {
        $("#statusDisplay").html("<label class='label label-danger'>Failed to add Project</label>");
        $("#statusDisplay").removeClass("hide");
        $("#statusDisplay").fadeOut(5000);
        console.log(errMsg);
      }
    });
  });

  // Have enter keys fire click event
  $('.addProject').keypress(function (e) {
    var key = e.which;
    if(key == 13)  // the enter key code
    {
      $("#submit-add-project").click();
      return false;
    }
  });

  // Global escape key listener - close all modals
  $(document).keyup(function(e) {
    if (e.keyCode == 27) { // escape key maps to keycode `27`
      $("#modal-add-project").modal('hide');
      $("#modal-edit-project").modal('hide');
    }
  });

  // Project removal click event listener
  $(document).on('click', '.removeProject', function() {
    console.log("Processing request to remove object with ID -> " + $(this).val());
    var prep = {};
    prep.id = $(this).val();
    var json = JSON.stringify(prep);
    // console.log("Sending :" + json);
    $(this).parent().parent().fadeOut();
    $.ajax({
      type: "delete",
      url: "/do/del",
      dataType: "json",
      data: json,
      contentType: "application/json",
      success: function(data){
        $("#statusDisplay").html("<label class='label label-success'>Project Removed</label>");
        $("#statusDisplay").removeClass("hide");
        $("#statusDisplay").fadeOut(5000);
      },
      failure: function(errMsg) {
        $("#statusDisplay").html("<label class='label label-danger'>Failed to remove Project</label>");
        $("#statusDisplay").removeClass("hide");
        $("#statusDisplay").fadeOut(5000);
        console.log(errMsg);
      }
    });
  });

  // Project removal click event listener
  $(document).on('click', '.canEdit', function() {
    // Extract
    var display = toCamelCase($(this).attr('pType'));
    if (display == "Goals") {
      display = "Grant Deliverables";
    } else if (display == "Software") {
      display = "Software Requirements";
    } else if (display == "Effort") {
      display = "Effort Requirements";
    } else if (display == "Date") {
      display = "Completion Target";
    }
    var tValue = $(this).attr('pType');
    var tID = $(this).attr('pID');
    var current = $(this).html();
    console.log("Update request on [" + display + "] to [" + current + "] and ID [" + tID + "]");

    // Update edit modal to reflect current status and carry required data to submit the edit
    $("#editTarget").html(display);
    $("#editTarget").attr('target-value', tValue);
    $("#editTarget").attr('target-id', tID);
    $("#edit-data").attr("placeholder", current);
    $("#edit-data").attr("value",current);

    // Show the modal
    $('#modal-edit-project').modal('show');
  });

  // Function pulled from stackoverflow to camel case a word
  // http://stackoverflow.com/questions/5086390/jquery-camelcase
  function toCamelCase(str) {
    return str.replace(/(?:^|\s)\w/g, function(match) {
      return match.toUpperCase();
    });
  }

  // Click event listener for update modal form submit button
  $("#submit-edit-project").click(function() {
    // Pull data from the model
    var target = $("#editTarget").attr('target-value');
    var value = $("#edit-data").attr('value');
    var id = $("#editTarget").attr('target-id');
    // console.log("Passed: target[" + target + "] value[" + value + "] from ID[" + id + "]");

    // Create project JSON object
    // Warning - this update statement is not safe
    // Users can modify the DOM element to point at arbitrary ID's and for arbitrary values
    // However, since all users can edit and see all items (no RBAC) this is a moot point
    var update = {};
    if (target = "area") {
      update.area = value;
    } else if (target = "name") {
      update.name = value;
    } else if (target = "leader") {
      update.leader = value;
    } else if (target = "members") {
      update.members = value;
    } else if (target = "date") {
      update.date = value;
    } else if (target = "goals") {
      update.goals = value;
    } else if (target = "software") {
      update.software = value;
    } else if (target = "effort") {
      update.effort = value;
    }
    var json = JSON.stringify(update);
    $.ajax({
      type: "post",
      url: "/do/update",
      dataType: "json",
      data: json,
      contentType: "application/json",
      success: function(data){
        console.log("Receieved back from add request: " + JSON.stringify(data));
        $("#statusDisplay").html("<label class='label label-success'>Project Added</label>");
        $("#statusDisplay").removeClass("hide");
        $("#statusDisplay").fadeOut(5000);
        addToTable(data[0]);
        $("#modal-add-project").find("input[type=text]").val("");
      },
      failure: function(errMsg) {
        $("#statusDisplay").html("<label class='label label-danger'>Failed to add Project</label>");
        $("#statusDisplay").removeClass("hide");
        $("#statusDisplay").fadeOut(5000);
        console.log(errMsg);
      }
    });
  });
});