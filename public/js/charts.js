// Builds a pie chart summarizing table content
var make_charts = function() {
  // Zero out current content
  $(".theCharts").empty();

  // Data collection
  // Project areas
  // Determine the total number of projects areas (and count them)
  var areas = [];
  var numberOfAreas = 0;
  $(".project-area").each(function(index, item) {
    areas.push(item.innerHTML);
    numberOfAreas++;
  });
  // Abort making any graphs if there is no data
  if (numberOfAreas < 1) {
    console.log("No data -> nothing to chart");
    return;
  }
  // Determine what project area has the most projects
  areas.sort();
  var area_last = "start";
  var area_count = 0;
  var area_countMax = 0;
  var area_countLeader = "No Projects";
  areas.forEach(function(area) {
    if ((area_last == "start") && (area_count == 0)) {
      // Handle the start case
      area_last = area
      area_count = 1;
    } else if (area_last == area) {
      // Item is the same, keep counting
      area_count++;
      if (area_count > area_countMax) {
        area_countMax = area_count;
        area_countLeader = area_last;
      }
    } else {
      if (area_count > area_countMax) {
        area_countMax = area_count;
        area_countLeader = area_last;
      }
      area_count = 1;
      area_last = area;
    }
  });
  if ((area_countLeader == "No Projects") && (area_last != "start")) {
    area_countLeader = area_last;
    area_countMax = area_count;
  }

  // Data collection
  // Project leaders
  // Determine the total number of projects leaders
  var leaders = [];
  var leaderRank = [];
  $(".project-leader").each(function(index, item) {
    leaders.push(item.innerHTML);
  });
  // Determine what project leaders have the most projects
  leaders.sort();
  var leader_last = "start";
  var leader_count = 0;
  leaders.forEach(function(leader) {
    if ((leader_last == "start") && (leader_count == 0)) {
      // Handle the start case
      leader_last = leader
      leader_count = 1;
    } else if (leader_last == leader) {
      // Item is the same, keep counting
      leader_count++;
    } else {
      // Load the data into the array of object, start tracking the new leader
      var leaderObject = {};
      leaderObject.leader_name = leader_last;
      leaderObject.count = leader_count;
      leaderRank.push(leaderObject);

      leader_count = 1;
      leader_last = leader;
    }
  });
  // Handle (save) whatever was leader_last
  var leaderObject = {};
  leaderObject.leader_name = leader_last;
  leaderObject.count = leader_count;
  leaderRank.push(leaderObject);
  // Sort the leader object list
  leaderRank.sort(function(a, b){
    var keyA = a.count,
    keyB = b.count;
    // console.log("Comparing " + JSON.stringify(a) + " to " + JSON.stringify(b));
    if(keyA > keyB) return -1;
    if(keyA < keyB) return 1;
    return 0;
  });
  // console.log("There are " + leaderRank.length + " leaders");

  // Data collection
  // Project Scheduale
  var schedualeTotal = 0;
  var schedualeOnTrack = 0;
  $(".project-scheduale").each(function(index, item) {
    schedualeTotal++;
    if (($(this).html() == "Ahead") || ($(this).html() == "On Track")) {
      schedualeOnTrack++;
    }
  });

  // Data collection
  // How many projects are due in the coming quarter
  var quarterNow = validDates[0];
  var occurringSoon = 0;
  $(".project-targetDate").each(function(index, item) {
    if ($(this).html() == quarterNow) {
      occurringSoon++;
    }
  });

  var at = 0;
  var to = 5;
  var leaderHTML = "<span class='summary-text'>Top " + to + " Project Leaders</span>";
  leaderHTML += "<ol>";
  if ( to >= leaderRank.length) {
    to = (leaderRank.length)-1;
    // console.log("There are too few leaders- instaed of top 3, showing top " + to);
  }
  while (at <= to) {
      leaderHTML += "<li><span class='summary-text-tiny-blue'>" + leaderRank[at].leader_name + "</span> <span class='summary-text-tiny'>(" + leaderRank[at].count + ")" +"</li>"
      at++
  }
  leaderHTML += "</ol>"

  // Build charts
  $('#chart1').html("<br><span class='summary-text'>Number of Projects:</span><br><span class='summary-text-blue'>" + numberOfAreas + "</span>");
  $('#chart2').html("<span class='summary-text-blue'>" + area_countLeader + "</span> <span class='summary-text'>has the most projects with</span> <span class='summary-text-blue'>" + area_countMax + "</span>");
  $('#chart3').html(leaderHTML);

  var rp3 = radialProgress(document.getElementById('chart4'))
    .label("Projects on Track")
    .diameter(150)
    .minValue(0)
    .maxValue(schedualeTotal)
    .value(schedualeOnTrack)
    .render();

  var rp3 = radialProgress(document.getElementById('chart5'))
    .label("Projects Due in " + quarterNow)
    .diameter(150)
    .minValue(0)
    .maxValue(numberOfAreas)
    .value(occurringSoon)
    .render();

  var rp3 = radialProgress(document.getElementById('chart6'))
    .label("Remaining Time in Q" + getQuarter())
    .diameter(150)
    .minValue(0)
    .maxValue(getTimeRemaining('total'))
    .value(getTimeRemaining())
    .render();
};
