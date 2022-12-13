let count = 0;
let countDBID = 1;
google.charts.load("current", {packages:["corechart"]});

function saveData(data1, data2, data3) {
    var dbPromise = indexedDB.open('my_database', 2);

    dbPromise.onupgradeneeded = function(event) {
        var db = event.target.result;

        // Create the 'data' object store if it doesn't already exist.
        if (!db.objectStoreNames.contains('data')) {
            var objectStore = db.createObjectStore('data', {keyPath: 'id'});
        }
    };

    dbPromise.onsuccess = function(event) {
        var db = event.target.result;

        var transaction = db.transaction(['data'], 'readwrite');
        var dataStore = transaction.objectStore('data');

        dataStore.add({id: countDBID, subject: data1, courseNumber: data2, semester: data3});
        countDBID++;

        transaction.oncomplete = function() {
            console.log("Data saved successfully.");
        };
    };
}

function clear(){
    const removeDiv = document.querySelectorAll('.mdc-deprecated-list-item');
    const removeTitle = document.querySelectorAll('.mdc-typography--headline6')
    // const removeCurrClass = document.querySelectorAll('.currClass')
    
    removeDiv.forEach(element => {
      element.remove();
    });

    removeTitle.forEach(element => {
      element.remove();
    });
    
    // removeCurrClass.forEach(box => {
    //   box.remove();
    // });
  
}

function search() {

  //condition makes sure it is not first search (nothing to clear if there is no previous search)
  if (count > 0){
    clear();
    
  }
  count++; // searches counter

  
  let subj = document.getElementById("subject").value; 
  let courseNum = document.getElementById("course_num").value;
  let semester = document.getElementById("semester").value;
  let theSemester;
  let notValid = false;
  // let currentClass = document.createElement("div");
  // currentClass.setAttribute("class", "currClass");
  

  //checks whether course number is invalid
  if(courseNum.length > 3){
    notValid = true;
  }
  else if(isNaN(courseNum) == true){
    notValid = true;
  }
  

  //checks if semester is 4 characters.
  if(semester.length != 4){
    notValid = true;
  }
  //Get semester name to output for title
  else if(semester[0].toUpperCase() == "F") 
    theSemester = "Fall";
  else if(semester[0].toUpperCase() == "S" && semester[1].toUpperCase() == "P")
    theSemester = "Spring";
  else if(semester[0].toUpperCase() == "S" && semester[1].toUpperCase() == "U") {
    theSemester = "Summer";
  }
  else{
    notValid = true;
  }


  if(notValid == true){
    console.log("NOT A VALID SEARCH");
    let notValidMessage = document.createElement("div");
    notValidMessage.setAttribute("class", "mdc-typography--headline6");
    document.body.append(notValidMessage);
    notValidMessage.innerHTML += "NOT A VALID SEARCH, TRY AGAIN.";
    return;
  }
  saveData(subj, courseNum, semester);
  //Get year for title
  let theYear = "20" + semester[2] + semester[3];

  //Connects correct link for API call that returns data that user wants.
  let link = 'https://Test-for-GD.adamnimer1.repl.co/api/allGrades?' + 'semester=' + 
  semester.toUpperCase() + "&subject=" + subj.toUpperCase() + "&class_num=" + courseNum;
  let idCounter = 0;

   fetch(link)
     .then((response) => {
       return response.json()
           })
     .then ((data) => {
       //Creates div element for title and sets it to its respective class title.
       let title = document.createElement("div");
       title.setAttribute("class", "mdc-typography--headline6");
       document.body.append(title);
       
       if(courseNum != "294"){ 
         title.innerHTML += data.response[0].subject + 
         data.response[0].class_num + ": " + data.response[0].class_title 
         + " Courses in " + theSemester + " " + theYear;  
       }
       else { //Handles edge case for 294 courses (since they have different titles)
         title.innerHTML += data.response[0].subject + 
         data.response[0].class_num + ": " + "Special Topics" 
         + " Courses in " + theSemester + " " + theYear;  
       }
       

        //Goes through each variant of the course for that semester and will output
        //the teacher in its own div.
        data.response.forEach((course) => {
          
          let oneInstance = document.createElement("div");
          document.body.append(oneInstance);
          oneInstance.setAttribute("id",idCounter);
          oneInstance.setAttribute("class", "mdc-deprecated-list-item");
          if(idCounter % 3 +1 == 0){
            oneInstance += '<br/>'
          }

          //If a div is clicked on, it will call the drawChart function which will output
          //the data for that specific course
          oneInstance.addEventListener("click", (event) => {
            event.preventDefault();
            let idNum = event.target.getAttribute("id");
            console.log(idNum);
            
            // currentClass.innerHTML = '<br/>' + data.response[idNum].class_title + ": " + "A: " + data.response[idNum].A + " B: " + data.response[idNum].B + " C: " + data.response[idNum].C + " D: " + data.response[idNum].D + " F: " + data.response[idNum].F + " Instructor: " + data.response[idNum].instructor; 
            //   document.body.append(currentClass);

            google.charts.load("current", {packages:["corechart"]});
            
            drawChart(course);
          })
          //Sets text for each div.
          oneInstance.innerHTML += "<br />" + "Instructor: " + course.instructor;
          idCounter+=1; //increments counter so next div has unique id.
          console.log(data)
        })
    })   
}



function drawChart(course) {
    var data = google.visualization.arrayToDataTable([
      ['Grades', 'Number'],
      ['A',     course.A],
      ['B',      course.B],
      ['C',  course.C],
      ['D', course.D],
      ['F',  course.F]
    ]);

    var options = {
      title: course.class_title + " with " + course.instructor,
      pieHole: 0.4,
    };

    var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
    chart.draw(data, options);
}   



function heart(){
  var dialog = mdc.dialog.MDCDialog.attachTo(document.querySelector('.mdc-dialog'))
  dialog.open()
}


function navigation(){
  var dialog = mdc.dialog.MDCDialog.attachTo(document.querySelector('.mdc-dialog'))
  dialog.open()
}


function clearWeather(){
  const removeIMG = document.querySelectorAll('.weatherImg')
  const removeDiv = document.querySelectorAll('.mdc-typography--headline6')
  const removeBR = document.querySelectorAll('.lineBreaks')
    // const removeCurrClass = document.querySelectorAll('.currClass')
    
    removeIMG.forEach(element => {
      element.remove();
    });
  
    removeDiv.forEach(element => {
      element.remove();
    });

    removeBR.forEach(element => {
    element.remove();
  });

  
}

function getWeatherData(){
  clearWeather();
      let link = "https://api.weather.gov/gridpoints/LOT/75,72/forecast";

    fetch(link)
      .then((response) => {
        return response.json()
            })
      
      .then ((data) => {
        data.properties.periods.forEach((period) => {
        let theDiv = document.createElement("div");
        theDiv.setAttribute("class", "mdc-typography--headline6");
        document.body.append(theDiv);
          
        theDiv.innerHTML = period.name + "<br>" + period.detailedForecast;
        var img = document.createElement("IMG");
        img.setAttribute("src", period.icon);
        img.setAttribute("class", "weatherImg");
        document.body.appendChild(img);
        let lineBreaks = document.createElement("div");
        lineBreaks.setAttribute("class", "lineBreaks");
        document.body.append(lineBreaks);
        lineBreaks.innerHTML += "<br>" + "<br>";
        })
      })}



function storedDataDisplay(){
  // Open a connection to the indexedDB
  var request = indexedDB.open('my_database');
  
  // Get a reference to the IDBDatabase object
  request.onsuccess = function(event) {
    var db = event.target.result;
  
    // Create a transaction to access the data
      var transaction = db.transaction(['data'], 'readonly');

  // Get a reference to the IDBObjectStore
  var dataStore = transaction.objectStore('data');
  
  // Retrieve the data
  var request = dataStore.getAll();

  // Loop through the data and add it to the page
  request.onsuccess = function(event) {
    console.log('Successfully retrieved data from indexedDB');
    var data = event.target.result;
    data.forEach(function(item) {
      var div = document.createElement('div');
      div.setAttribute("class", "dataStore");
      div.innerHTML += item.subject + ' - ' + item.courseNumber + ' - ' + item.semester;
      document.body.appendChild(div);
        });
      }
    };
  }


function clearStoredData(){
  const removeDiv = document.querySelectorAll('.dataStore')
    // const removeCurrClass = document.querySelectorAll('.currClass')
    
    removeDiv.forEach(element => {
      element.remove();
    });
  
  
}



function home(){
  console.log("home")
  clear(); //clears any grade data
  clearWeather();
  clearStoredData();
  //hide and show respective pages
  var weather = document.getElementById("weather").hidden = true;
    var data = document.getElementById("storedData").hidden = true;
  var grades = document.getElementById("grades").hidden= true;
    var home = document.getElementById("home").hidden = false;
  
}



function grades(){
  console.log("grades")
  clearWeather();
  clearStoredData();
  var home = document.getElementById("home").hidden = true;
  var weather = document.getElementById("weather").hidden = true;
  var data = document.getElementById("storedData").hidden = true;
  var grades = document.getElementById("grades").hidden= false;
  
}


function weather(){
  clear(); //clears any grade data
  //hide and show respective pages
  clearStoredData();
  console.log("weather")
  var home = document.getElementById("home").hidden = true;
  var gradesScreen = document.getElementById("grades").hidden = true;
  var data = document.getElementById("storedData").hidden = true;
  getWeatherData();
  var weather = document.getElementById("weather").hidden = false;
  

}
  

function storedData(){
  clear(); //clears any grade data
  clearWeather();
  if(countDBID > 1)
  storedDataDisplay();
  //hide and show respective pages
  console.log("data")
  var home = document.getElementById("home").hidden = true;
  var weather = document.getElementById("weather").hidden = true;
  var grades = document.getElementById("grades").hidden= true;
  var data = document.getElementById("storedData").hidden = false;
}




         // showD.innerHTML += data.response[idNum].class_title + ": " + "A: " + data.response[idNum].A + " B: " + data.response[idNum].B + " C: " + data.response[idNum].C + " D: " + data.response[idNum].D + " F: " + data.response[idNum].F + " Instructor: " + data.response[idNum].instructor; 