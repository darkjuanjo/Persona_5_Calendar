/* BEFORE YOU START
All the calendar data is stored in an object named Calendar.
Inside the Calendar you can set the display language of to either English or Japanese.
Display_Type is used to specify if you want the calendar fully in Japanese or only Half.
Half only changes the Day of the week while Full affects every items except alerts.
Note that you need to provide your own openweather key in order for the weather to work.

Widget is draggable so feel free to move it anywhere, however widget will reset to the
default position if widget is reloaded.

Widget is draggable so feel free to move it anywhere, however widget will reset to the
default position if widget is reloaded.
If you click the weather icon (*note not the white) it will open openweather with your city
information.

For any changes you do makes sure to refresh all widgets. Otherwise timers starts adding up.

*/

export const command = 'date +"%m %d %A %H"';
export const refreshFrequency = 1000;

const Calendar = {
  Display_Language: "Japanese", //English - Japanese
  Display_Type: "Half", //Japanese Only : Full - Half
  Folder: "Persona_5_Calendar/Calendar_Assets/",
  Month: 0,
  Day: 0,
  DayofWeek: "Taco Tuesday!",
  TimeofDay: "Early Morning",
  Location: "Woburn, US",
  Key: "", //openweather key
  Weather: {
   Main: "None",
   FeelsLike: "None",
   MainTemp: "None",
   Description: "None",
   IconID: "None",
   Icon: "None",
   WebID: "None",
   Alert: "None",
   Frame: 0
  },
  Theme: 0
}

var initialrender = true;
var seconds = 0;
var Timer = clearInterval(Timer);;
export const className =`
.Calendar{
position: absolute;
top: 0px;
right: 0px;
left: 35px;
Opacity: 80%;
Transform: scale(0.8)
}
`
export const render = (output) => {
  return (
    <div className ="Calendar" id="Calendar">
    <img id="white_month"></img>
    <img id="white_digit1"></img>
    <img id="white_digit2"></img>
    <img id="white_weather"></img>
    <img id="DayName_white"></img>
    <img id="black_month"></img>
    <img id="black_digit1"></img>
    <img id="black_digit2"></img>
    <img id="DayName_black"></img>
    <img id="filler"></img>
    <img id="month"></img>
    <img id="digit1"></img>
    <img id="digit2"></img>
    <img id="dayname"></img>
    <img id="timename"></img>
    <div id="WeatherRef">
    <a id = "wref">
    <img id="weather"></img>
    </a>
    </div>
    <img id="alert"></img>
    <p id ="test"></p>
    </div>
  );
}
Timer = setInterval(animation, 300);
export const updateState = (event, previousState) => {
try{
  //console.time();
  seconds++;
  if (event.error) {
    console.error('ERROR: ', event.error)
    return previousState
  }
  if(initialrender == true)
  {
  let widget = document.getElementById("Calendar");
  DraggableWidget(widget);
  }
  let newCal = event.output.split(' ');
  let result = Change(newCal);
  if(result.Month)
  {
  Calendar.Month = newCal[0];
  setMonth();
  }
  if(result.Day)
  {
  Calendar.Day = newCal[1];
  setDay();
  }
  if(result.DayofWeek)
  {
    Calendar.DayofWeek = newCal[2];
    switch(Calendar.Display_Language){
      case "English":
          setDayofWeekEnglish();
      break;
      case "Japanese":
          setDayofWeekJapanese();
      break;
      default:
          setDayofWeekEnglish();
    }
  }
  if(result.TimeofDay.Change)
  {
    Calendar.TimeofDay = result.TimeofDay.Value;
    switch(Calendar.Display_Language){
      case "English":
            setTimeofDayEnglish();
      break;
      case "Japanese":
         if(Calendar.Display_Type == "Half")
              setTimeofDayEnglish();
              if(Calendar.Display_Type == "Full")
                   setTimeofDayJapanese();
      break;
      default:
          setTimeofDayEnglish();
    }
  }


  if(seconds == 300 || initialrender == true)
  {
    if(Calendar.Key != null && Calendar.Key != undefined && Calendar.Key != "none" && Calendar.Key != "None" && Calendar.Key != "")
    getWeather();
    else {
      Calendar.Weather.Icon = "loading.gif";
      Calendar.Weather.Alert = "None";
      setWeatherError();
    }
    if(initialrender != true)
    seconds = 0;
    initialrender = false;
  }
}
catch
 {
 location.reload();
}
// console.timeEnd();
}
function DraggableWidget(widget)
{
   var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
   document.getElementById(widget.id).onmousedown = dragMouseDown;

   function dragMouseDown(e)
    {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX; //position x
      pos4 = e.clientY; //position y
      document.onmouseup = closeDragElement; //stop dragging
      document.onmousemove = elementDrag; //start dragging
   }
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX; //new xposition = x - new x
      pos2 = pos4 - e.clientY; // new yposition = y - new y
      pos3 = e.clientX; //new x
      pos4 = e.clientY; // new y
      widget.style.top = (widget.offsetTop - pos2) + "px"; //set new y position
      widget.style.left = (widget.offsetLeft - pos1) + "px"; //set new x position
    }

    function closeDragElement() {
      document.onmouseup = null; //stop changes
      document.onmousemove = null; //stop changes
    }
}

function Change(changes)
{
 const result = {
 Month :false,
 Day : false,
 DayofWeek : false,
 TimeofDay : {
   Change : false,
   Value:  "Early Morning"
 }
}

  if(Calendar.Month != changes[0])
    result.Month = true;

  if(Calendar.Day != changes[1])
  {result.Day = true; result.DayofWeek = true}

if(Calendar.Display_Language == "English" || (Calendar.Display_Language == "Japanese" && Calendar.Display_Type == "Half"))
{
 switch (true){
   case (changes[3] >= 4 && changes[3] <= 7 ):
   changes[3] = "Early Morning";
   break;
   case (changes[3] >= 8 && changes[3] <= 11 ):
   changes[3] = "Morning";
   break;
   case (changes[3] >= 12 && changes[3] <= 14 ):
   changes[3] = "Afternoon";
   break;
   case (changes[3] >= 15 && changes[3] <= 17 ):
   changes[3] = "DayTime";
   break;
   case (changes[3] >= 18 && changes[3] <= 23 || changes[3] >= 0 && changes[3] <= 3 ):
   changes[3] = "Evening";
   break;
   default:
   changes[3] = "Early Morning";
 }

  if(Calendar.TimeofDay != changes[3])
  {
    result.TimeofDay.Change = true;
    result.TimeofDay.Value = changes[3];
  }

}

if(Calendar.Display_Language == "Japanese" && Calendar.Display_Type == "Full")
{
 switch (true){
   case (changes[3] >= 4 && changes[3] <= 9 ):
   changes[3] = "Morning";
   break;
   case (changes[3] >= 10 && changes[3] <= 11 ):
   changes[3] = "BeforeNoon";
   break;
   case (changes[3] >= 12 && changes[3] <= 17 ):
   changes[3] = "DayTime";
   break;
   case (changes[3] >= 18 && changes[3] <= 22):
   changes[3] = "Night";
   break;
   case (changes[3] == 23 || changes[3] >= 0 && changes[3] <= 3 ):
   changes[3] = "LateNight";
   break;
   default:
   changes[3] = "Morning";
 }

  if(Calendar.TimeofDay != changes[3])
  {
    result.TimeofDay.Change = true;
    result.TimeofDay.Value = changes[3];
  }

}

  return result;
}

function setMonth()
{
  const white_month_image = document.getElementById('white_month');
  const black_month_image = document.getElementById('black_month');
  const month_image = document.getElementById('month');

  white_month_image.src = Calendar.Folder + 'Month/' + 'BaseWhite_' + Calendar.Month + '.png';
  white_month_image.style.position = "absolute";
  white_month_image.style.left = 0 + "px";
  white_month_image.style.top = 25 + "px";
  if(Calendar.Theme == 0)
  white_month_image.style.filter = 'invert(0)';
  else
  white_month_image.style.filter = 'invert(1)';


  black_month_image.src = Calendar.Folder + 'Month/' + 'BaseBlack_' + Calendar.Month + '.png';
  black_month_image.style.position = "absolute";
  black_month_image.style.left = 0 + "px";
  black_month_image.style.top = 25 + "px";
  if(Calendar.Theme== 0)
  black_month_image.style.filter = 'invert(0)';
  else
  black_month_image.style.filter = 'invert(1)';

  month_image.src = Calendar.Folder + 'Month/' + Calendar.Month + '.png';
  month_image.style.position = "absolute";
  month_image.style.left = 0 + "px";
  month_image.style.top = 25 + "px";
  if(Calendar.Theme == 0)
  month_image.style.filter = 'invert(0)';
  else
  month_image.style.filter = 'invert(1)';
}

function setDay()
{
  const white_digit1_image = document.getElementById('white_digit1');
  const white_digit2_image = document.getElementById('white_digit2');
  const black_digit1_image = document.getElementById('black_digit1');
  const black_digit2_image = document.getElementById('black_digit2');
  const filler_image = document.getElementById('filler');
  const digit1_image = document.getElementById('digit1');
  const digit2_image = document.getElementById('digit2');
  let digit1;
  let digit2;
  switch(true){
  case (Calendar.Day <= 9):
  digit1 = parseInt(Calendar.Day);
  digit2 = "none";
  white_digit2_image.style.display = "none";
  black_digit2_image.style.display = "none";
  filler_image.style.display = "none";
  digit2_image.style.display = "none";
  break;
  case (Calendar.Day > 9):
  digit1 = parseInt(Calendar.Day/10);
  digit2 = parseInt(Calendar.Day)%10;

  white_digit2_image.style.display = "inline";
  black_digit2_image.style.display = "inline";
  filler_image.style.display = "inline";
  digit2_image.style.display = "inline";
  break
  default:
  digit1 = 1;
  digit2 = 0;
  white_digit2_image.style.display = "inline";
  black_digit2_image.style.display = "inline";
  filler_image.style.display = "inline";
  digit2_image.style.display = "inline";
}

//setting up digit 1//
white_digit1_image.src = Calendar.Folder + 'Day/' + 'BaseWhite_' + digit1 + '.png';
white_digit1_image.style.position = "absolute";
white_digit1_image.style.left = 68 + "px";
white_digit1_image.style.top = 20 + "px";
white_digit1_image.style.transform = 'rotate(5deg)';
if(Calendar.Theme == 0)
white_digit1_image.style.filter = 'invert(0)';
else
white_digit1_image.style.filter = 'invert(1)';


black_digit1_image.src = Calendar.Folder + 'Day/' + 'BaseBlack_' + digit1 + '.png';
black_digit1_image.style.position = "absolute";
black_digit1_image.style.left = 72 + "px";
black_digit1_image.style.top = 25 + "px";
black_digit1_image.style.transform = 'rotate(5deg)';
if(Calendar.Theme == 0)
black_digit1_image.style.filter = 'invert(0)';
else
black_digit1_image.style.filter = 'invert(1)';


digit1_image.src = Calendar.Folder + 'Day/' + digit1 + '.png';
digit1_image.style.position = "absolute";
digit1_image.style.left = 88 + "px";
digit1_image.style.top = 35 + "px";
digit1_image.style.transform = 'rotate(5deg)';
if(Calendar.Theme == 0)
digit1_image.style.filter = 'invert(0)';
else
digit1_image.style.filter = 'invert(1)';

//setting up digit 2//
white_digit2_image.src = Calendar.Folder + 'Day/' + 'BaseWhite_' + digit2 + '.png';
white_digit2_image.style.position = "absolute";
white_digit2_image.style.transform = "rotate(3deg)";
white_digit2_image.style.left = 120 + "px";
white_digit2_image.style.top = 5 + "px";
if(Calendar.Theme == 0)
white_digit2_image.style.filter = 'invert(0)';
else
white_digit2_image.style.filter = 'invert(1)';

black_digit2_image.src = Calendar.Folder + 'Day/' + 'BaseBlack_' + digit2 + '.png';
black_digit2_image.style.position = "absolute";
black_digit2_image.style.transform = "rotate(3deg)";
black_digit2_image.style.left = 124 + "px";
black_digit2_image.style.top = 10 + "px";
if(Calendar.Theme == 0)
black_digit2_image.style.filter = 'invert(0)';
else
black_digit2_image.style.filter = 'invert(1)';

filler_image.src = Calendar.Folder + 'Day/' + 'Filler' + '.png';
filler_image.style.position = "absolute";
filler_image.style.left = 120 + "px";
filler_image.style.top = 45 + "px";
if(Calendar.Theme == 0)
filler_image.style.filter = 'invert(0)';
else
filler_image.style.filter = 'invert(1)';

digit2_image.src = Calendar.Folder + 'Day/' + digit2 + '.png';
digit2_image.style.position = "absolute";
digit2_image.style.transform = "rotate(3deg)";
digit2_image.style.left = 140 + "px";
digit2_image.style.top = 20 + "px";
if(Calendar.Theme == 0)
digit2_image.style.filter = 'invert(0)';
else
digit2_image.style.filter = 'invert(1)';
}

function setDayofWeekEnglish()
{
  const dayname_white_image = document.getElementById('DayName_white');
  const dayname_black_image = document.getElementById('DayName_black');
  const dayname_image = document.getElementById('dayname');
  const weekday_x = 80;
  const weekday_y = 35;
  const weekday_offsetx = 0;
  const weekday_offsety = 0;
  const weekday_displayoffsetx = 0;
  const weekday_displayoffsety = 0;
  let _weekday_x = weekday_x;
  let _weekday_y = 50;
  let _weekday_offsetx = weekday_offsetx;
  let _weekday_offsety = weekday_offsety;
  let _weekday_displayoffsetx = weekday_displayoffsetx;
  let _weekday_displayoffsety = weekday_displayoffsety;

 switch (Calendar.DayofWeek){
   case "Sunday":
   dayname_white_image.src = Calendar.Folder + 'DayName/' + 'BaseWhite_Sunday' + '.png';
   dayname_black_image.src = Calendar.Folder + 'DayName/' + 'BaseBlack_Sunday' + '.png';
   dayname_image.src = Calendar.Folder + 'DayName/' + 'Sunday' + '.png';

   _weekday_offsetx = weekday_x + 9;
   _weekday_offsety = weekday_y + 23 + 15;
   _weekday_displayoffsetx = weekday_x + 13;
   _weekday_displayoffsety = weekday_y + 29 + 15;

   dayname_white_image.style.position = "absolute";
   dayname_white_image.style.left = _weekday_x + 6 + "px";
   dayname_white_image.style.top = _weekday_y + 15 + "px";

   dayname_black_image.style.position = "absolute";
   dayname_black_image.style.left = _weekday_offsetx - 1 + "px";
   dayname_black_image.style.top = _weekday_offsety - 8 + "px";

   dayname_image.style.position = "absolute";
   dayname_image.style.left = _weekday_displayoffsetx - 5 + "px";
   dayname_image.style.top = _weekday_displayoffsety - 15 + "px";

   break;
   case "Monday":
   dayname_white_image.src = Calendar.Folder + 'DayName/' + 'BaseWhite_Monday' + '.png';
   dayname_black_image.src = Calendar.Folder + 'DayName/' + 'BaseBlack_Monday' + '.png';
   dayname_image.src = Calendar.Folder + 'DayName/' + 'Monday' + '.png';

   _weekday_offsetx = weekday_x + 10;
   _weekday_offsety = weekday_y + 23 + 15;
   _weekday_displayoffsetx = weekday_x + 16;
   _weekday_displayoffsety = weekday_y + 27 + 15;

   dayname_white_image.style.position = "absolute";
   dayname_white_image.style.left = _weekday_x + 6 + "px";
   dayname_white_image.style.top = _weekday_y + 15 + "px";

   dayname_black_image.style.position = "absolute";
   dayname_black_image.style.left = _weekday_offsetx - 1 + "px";
   dayname_black_image.style.top = _weekday_offsety - 8 + "px";

   dayname_image.style.position = "absolute";
   dayname_image.style.left = _weekday_displayoffsetx - 5 + "px";
   dayname_image.style.top = _weekday_displayoffsety - 15 + "px";

   break;
   case "Tuesday":
   dayname_white_image.src = Calendar.Folder + 'DayName/' + 'BaseWhite_Tuesday' + '.png';
   dayname_black_image.src = Calendar.Folder + 'DayName/' + 'BaseBlack_Tuesday' + '.png';
   dayname_image.src = Calendar.Folder + 'DayName/' + 'Tuesday' + '.png';

   _weekday_offsetx = weekday_x + 10;
   _weekday_offsety = weekday_y + 23 + 15;
   _weekday_displayoffsetx = weekday_x + 15;
   _weekday_displayoffsety = weekday_y + 26 + 15;

   dayname_white_image.style.position = "absolute";
   dayname_white_image.style.left = _weekday_x + 6 + "px";
   dayname_white_image.style.top = _weekday_y + 15 + "px";

   dayname_black_image.style.position = "absolute";
   dayname_black_image.style.left = _weekday_offsetx - 1 + "px";
   dayname_black_image.style.top = _weekday_offsety - 8 + "px";

   dayname_image.style.position = "absolute";
   dayname_image.style.left = _weekday_displayoffsetx - 5 + "px";
   dayname_image.style.top = _weekday_displayoffsety - 15 + "px";

   break;
   case "Wednesday":
   dayname_white_image.src = Calendar.Folder + 'DayName/' + 'BaseWhite_Wednesday' + '.png';
   dayname_black_image.src = Calendar.Folder + 'DayName/' + 'BaseBlack_Wednesday' + '.png';
   dayname_image.src = Calendar.Folder + 'DayName/' + 'Wednesday' + '.png';

   _weekday_offsetx = weekday_x + 10;
   _weekday_offsety = weekday_y + 23 + 15;
   _weekday_displayoffsetx = weekday_x + 17;
   _weekday_displayoffsety = weekday_y + 28 + 15;

   dayname_white_image.style.position = "absolute";
   dayname_white_image.style.left = _weekday_x + 2 + "px";
   dayname_white_image.style.top = _weekday_y + 5 + "px";

   dayname_black_image.style.position = "absolute";
   dayname_black_image.style.left = _weekday_offsetx - 10 + "px";
   dayname_black_image.style.top = _weekday_offsety - 18 + "px";

   dayname_image.style.position = "absolute";
   dayname_image.style.left = _weekday_displayoffsetx - 15 + "px";
   dayname_image.style.top = _weekday_displayoffsety - 25 + "px";

   break;
   case "Thursday":
   dayname_white_image.src = Calendar.Folder + 'DayName/' + 'BaseWhite_Thursday' + '.png';
   dayname_black_image.src = Calendar.Folder + 'DayName/' + 'BaseBlack_Thursday' + '.png';
   dayname_image.src = Calendar.Folder + 'DayName/' + 'Thursday' + '.png';

   _weekday_offsetx = weekday_x + 13;
   _weekday_offsety = weekday_y + 23 + 15;
   _weekday_displayoffsetx = weekday_x + 20;
   _weekday_displayoffsety = weekday_y + 27 + 15;

   dayname_white_image.style.position = "absolute";
   dayname_white_image.style.left = _weekday_x + 12 + "px";
   dayname_white_image.style.top = _weekday_y + 15 + "px";

   dayname_black_image.style.position = "absolute";
   dayname_black_image.style.left = _weekday_offsetx - 1 + "px";
   dayname_black_image.style.top = _weekday_offsety - 8 + "px";

   dayname_image.style.position = "absolute";
   dayname_image.style.left = _weekday_displayoffsetx - 5 + "px";
   dayname_image.style.top = _weekday_displayoffsety - 15 + "px";

   break;
   case "Friday":
   dayname_white_image.src = Calendar.Folder + 'DayName/' + 'BaseWhite_Friday' + '.png';
   dayname_black_image.src = Calendar.Folder + 'DayName/' + 'BaseBlack_Friday' + '.png';
   dayname_image.src = Calendar.Folder + 'DayName/' + 'Friday' + '.png';

   _weekday_offsetx = weekday_x + 13;
   _weekday_offsety = weekday_y + 22 + 15;
   _weekday_displayoffsetx = weekday_x + 22;
   _weekday_displayoffsety = weekday_y + 25 + 15;

   dayname_white_image.style.position = "absolute";
   dayname_white_image.style.left = _weekday_x + 15 + "px";
   dayname_white_image.style.top = _weekday_y + 15 + "px";

   dayname_black_image.style.position = "absolute";
   dayname_black_image.style.left = _weekday_offsetx + 5 + "px";
   dayname_black_image.style.top = _weekday_offsety - 8 + "px";

   dayname_image.style.position = "absolute";
   dayname_image.style.left = _weekday_displayoffsetx - 5 + "px";
   dayname_image.style.top = _weekday_displayoffsety - 15 + "px";

   break;
   case "Saturday":
   dayname_white_image.src = Calendar.Folder + 'DayName/' + 'BaseWhite_Saturday' + '.png';
   dayname_black_image.src = Calendar.Folder + 'DayName/' + 'BaseBlack_Saturday' + '.png';
   dayname_image.src = Calendar.Folder + 'DayName/' + 'Saturday' + '.png';

   _weekday_offsetx = weekday_x + 10;
   _weekday_offsety = weekday_y + 23 + 15;
   _weekday_displayoffsetx = weekday_x + 16;
   _weekday_displayoffsety = weekday_y + 28 + 15;

   dayname_white_image.style.position = "absolute";
   dayname_white_image.style.left = _weekday_x - 7 + "px";
   dayname_white_image.style.top = _weekday_y + 5 + "px";

   dayname_black_image.style.position = "absolute";
   dayname_black_image.style.left = _weekday_offsetx - 12 + "px";
   dayname_black_image.style.top = _weekday_offsety - 32  + "px";

   dayname_image.style.position = "absolute";
   dayname_image.style.left = _weekday_displayoffsetx - 5 + "px";
   dayname_image.style.top = _weekday_displayoffsety - 15 + "px";

   break;
   default:
   dayname_white_image.src = Calendar.Folder + 'DayName/' + 'BaseWhite_Tuesday' + '.png';
   dayname_black_image.src = Calendar.Folder + 'DayName/' + 'BaseBlack_Tuesday' + '.png';
   dayname_image.src = Calendar.Folder + 'DayName/' + 'Tuesday' + '.png';

   _weekday_offsetx = weekday_x + 10;
   _weekday_offsety = weekday_y + 23 + 15;
   _weekday_displayoffsetx = weekday_x + 15;
   _weekday_displayoffsety = weekday_y + 26 + 15;

   dayname_white_image.style.position = "absolute";
   dayname_white_image.style.left = _weekday_x + 6 + "px";
   dayname_white_image.style.top = _weekday_y + 15 + "px";

   dayname_black_image.style.position = "absolute";
   dayname_black_image.style.left = _weekday_offsetx - 1 + "px";
   dayname_black_image.style.top = _weekday_offsety - 8 + "px";

   dayname_image.style.position = "absolute";
   dayname_image.style.left = _weekday_displayoffsetx - 5 + "px";
   dayname_image.style.top = _weekday_displayoffsety - 15 + "px";
   break;
 }

 if(Calendar.Theme == 0)
 {
   dayname_white_image.style.filter = 'invert(0)';
   dayname_black_image.style.filter = 'invert(0)';
   dayname_image.style.filter = 'invert(0)';
 }
 else
 {
   dayname_white_image.style.filter = 'invert(1)';
   dayname_black_image.style.filter = 'invert(1)';
   if(Calendar.DayofWeek != "Saturday" && Calendar.DayofWeek != "Sunday")
   dayname_image.style.filter = 'invert(1)';
   else
   dayname_image.style.filter = 'invert(0)';
 }

}

function setDayofWeekJapanese()
{
  const dayname_white_image = document.getElementById('DayName_white');
  const dayname_black_image = document.getElementById('DayName_black');
  const dayname_image = document.getElementById('dayname');
  const weekday_x = 80;
  const weekday_y = 35;
  const weekday_offsetx = 0;
  const weekday_offsety = 0;
  const weekday_displayoffsetx = 0;
  const weekday_displayoffsety = 0;
  let _weekday_x = weekday_x;
  let _weekday_y = 50;
  let _weekday_offsetx = weekday_offsetx;
  let _weekday_offsety = weekday_offsety;
  let _weekday_displayoffsetx = weekday_displayoffsetx;
  let _weekday_displayoffsety = weekday_displayoffsety;

 switch (Calendar.DayofWeek){
   case "Sunday":
   dayname_white_image.src = Calendar.Folder + 'DayName/Japanese/' + 'BaseWhite_Sunday' + '.png';
   dayname_black_image.src = Calendar.Folder + 'DayName/Japanese/' + 'BaseBlack_Sunday' + '.png';
   dayname_image.src = Calendar.Folder + 'DayName/Japanese/' + 'Sunday' + '.png';

   _weekday_offsetx = weekday_x + 9;
   _weekday_offsety = weekday_y + 23 + 15;
   _weekday_displayoffsetx = weekday_x + 13;
   _weekday_displayoffsety = weekday_y + 29 + 15;

   dayname_white_image.style.position = "absolute";
   dayname_white_image.style.transform = "rotate(-10deg)";
   dayname_white_image.style.left = _weekday_x + 18 + "px";
   dayname_white_image.style.top = _weekday_y + 2 + "px";

   dayname_black_image.style.position = "absolute";
   dayname_black_image.style.transform = "rotate(-10deg)";
   dayname_black_image.style.left = _weekday_offsetx + 15 + "px";
   dayname_black_image.style.top = _weekday_offsety + 3 + "px";

   dayname_image.style.position = "absolute";
   dayname_image.style.transform = "rotate(-10deg)";
   dayname_image.style.left = _weekday_displayoffsetx + 13 + "px";
   dayname_image.style.top = _weekday_displayoffsety + 3 + "px";

   break;
   case "Monday":
   dayname_white_image.src = Calendar.Folder + 'DayName/Japanese/' + 'BaseWhite_Monday' + '.png';
   dayname_black_image.src = Calendar.Folder + 'DayName/Japanese/' + 'BaseBlack_Monday' + '.png';
   dayname_image.src = Calendar.Folder + 'DayName/Japanese/' + 'Monday' + '.png';

   _weekday_offsetx = weekday_x + 10;
   _weekday_offsety = weekday_y + 23 + 15;
   _weekday_displayoffsetx = weekday_x + 16;
   _weekday_displayoffsety = weekday_y + 27 + 15;

   dayname_white_image.style.position = "absolute";
   dayname_white_image.style.transform = "rotate(-10deg)";
   dayname_white_image.style.left = _weekday_x + 18 + "px";
   dayname_white_image.style.top = _weekday_y + 2 + "px";

   dayname_black_image.style.position = "absolute";
   dayname_black_image.style.transform = "rotate(-10deg)";
   dayname_black_image.style.left = _weekday_offsetx + 15 + "px";
   dayname_black_image.style.top = _weekday_offsety + 3 + "px";

   dayname_image.style.position = "absolute";
   dayname_image.style.transform = "rotate(-10deg)";
   dayname_image.style.left = _weekday_displayoffsetx + 13 + "px";
   dayname_image.style.top = _weekday_displayoffsety + 3 + "px";

   break;
   case "Tuesday":
   dayname_white_image.src = Calendar.Folder + 'DayName/Japanese/' + 'BaseWhite_Tuesday' + '.png';
   dayname_black_image.src = Calendar.Folder + 'DayName/Japanese/' + 'BaseBlack_Tuesday' + '.png';
   dayname_image.src = Calendar.Folder + 'DayName/Japanese/' + 'Tuesday' + '.png';

   _weekday_offsetx = weekday_x + 10;
   _weekday_offsety = weekday_y + 23 + 15;
   _weekday_displayoffsetx = weekday_x + 15;
   _weekday_displayoffsety = weekday_y + 26 + 15;

   dayname_white_image.style.position = "absolute";
   dayname_white_image.style.transform = "rotate(-10deg)";
   dayname_white_image.style.left = _weekday_x + 18 + "px";
   dayname_white_image.style.top = _weekday_y + 2 + "px";

   dayname_black_image.style.position = "absolute";
   dayname_black_image.style.transform = "rotate(-10deg)";
   dayname_black_image.style.left = _weekday_offsetx + 15 + "px";
   dayname_black_image.style.top = _weekday_offsety + 3 + "px";

   dayname_image.style.position = "absolute";
   dayname_image.style.transform = "rotate(-10deg)";
   dayname_image.style.left = _weekday_displayoffsetx + 13 + "px";
   dayname_image.style.top = _weekday_displayoffsety + 3 + "px";

   break;
   case "Wednesday":
   dayname_white_image.src = Calendar.Folder + 'DayName/Japanese/' + 'BaseWhite_Wednesday' + '.png';
   dayname_black_image.src = Calendar.Folder + 'DayName/Japanese/' + 'BaseBlack_Wednesday' + '.png';
   dayname_image.src = Calendar.Folder + 'DayName/Japanese/' + 'Wednesday' + '.png';

   _weekday_offsetx = weekday_x + 10;
   _weekday_offsety = weekday_y + 23 + 15;
   _weekday_displayoffsetx = weekday_x + 17;
   _weekday_displayoffsety = weekday_y + 28 + 15;

   dayname_white_image.style.position = "absolute";
   dayname_white_image.style.transform = "rotate(-10deg)";
   dayname_white_image.style.left = _weekday_x + 18 + "px";
   dayname_white_image.style.top = _weekday_y + 2 + "px";

   dayname_black_image.style.position = "absolute";
   dayname_black_image.style.transform = "rotate(-10deg)";
   dayname_black_image.style.left = _weekday_offsetx + 15 + "px";
   dayname_black_image.style.top = _weekday_offsety + 3 + "px";

   dayname_image.style.position = "absolute";
   dayname_image.style.transform = "rotate(-10deg)";
   dayname_image.style.left = _weekday_displayoffsetx + 13 + "px";
   dayname_image.style.top = _weekday_displayoffsety + 3 + "px";

   break;
   case "Thursday":
   dayname_white_image.src = Calendar.Folder + 'DayName/Japanese/' + 'BaseWhite_Thursday' + '.png';
   dayname_black_image.src = Calendar.Folder + 'DayName/Japanese/' + 'BaseBlack_Thursday' + '.png';
   dayname_image.src = Calendar.Folder + 'DayName/Japanese/' + 'Thursday' + '.png';

   _weekday_offsetx = weekday_x + 13;
   _weekday_offsety = weekday_y + 23 + 15;
   _weekday_displayoffsetx = weekday_x + 20;
   _weekday_displayoffsety = weekday_y + 27 + 15;

   dayname_white_image.style.position = "absolute";
   dayname_white_image.style.transform = "rotate(-10deg)";
   dayname_white_image.style.left = _weekday_x + 18 + "px";
   dayname_white_image.style.top = _weekday_y + 2 + "px";

   dayname_black_image.style.position = "absolute";
   dayname_black_image.style.transform = "rotate(-10deg)";
   dayname_black_image.style.left = _weekday_offsetx + 15 + "px";
   dayname_black_image.style.top = _weekday_offsety + 3 + "px";

   dayname_image.style.position = "absolute";
   dayname_image.style.transform = "rotate(-10deg)";
   dayname_image.style.left = _weekday_displayoffsetx + 13 + "px";
   dayname_image.style.top = _weekday_displayoffsety + 3 + "px";

   break;
   case "Friday":
   dayname_white_image.src = Calendar.Folder + 'DayName/Japanese/' + 'BaseWhite_Friday' + '.png';
   dayname_black_image.src = Calendar.Folder + 'DayName/Japanese/' + 'BaseBlack_Friday' + '.png';
   dayname_image.src = Calendar.Folder + 'DayName/Japanese/' + 'Friday' + '.png';

   _weekday_offsetx = weekday_x + 13;
   _weekday_offsety = weekday_y + 22 + 15;
   _weekday_displayoffsetx = weekday_x + 22;
   _weekday_displayoffsety = weekday_y + 25 + 15;

   dayname_white_image.style.position = "absolute";
   dayname_white_image.style.transform = "rotate(-10deg)";
   dayname_white_image.style.left = _weekday_x + 18 + "px";
   dayname_white_image.style.top = _weekday_y + 2 + "px";

   dayname_black_image.style.position = "absolute";
   dayname_black_image.style.transform = "rotate(-10deg)";
   dayname_black_image.style.left = _weekday_offsetx + 15 + "px";
   dayname_black_image.style.top = _weekday_offsety + 3 + "px";

   dayname_image.style.position = "absolute";
   dayname_image.style.transform = "rotate(-10deg)";
   dayname_image.style.left = _weekday_displayoffsetx + 13 + "px";
   dayname_image.style.top = _weekday_displayoffsety + 3 + "px";

   break;
   case "Saturday":
   dayname_white_image.src = Calendar.Folder + 'DayName/Japanese/' + 'BaseWhite_Saturday' + '.png';
   dayname_black_image.src = Calendar.Folder + 'DayName/Japanese/' + 'BaseBlack_Saturday' + '.png';
   dayname_image.src = Calendar.Folder + 'DayName/Japanese/' + 'Saturday' + '.png';

   _weekday_offsetx = weekday_x + 10;
   _weekday_offsety = weekday_y + 23 + 15;
   _weekday_displayoffsetx = weekday_x + 16;
   _weekday_displayoffsety = weekday_y + 28 + 15;

   dayname_white_image.style.position = "absolute";
   dayname_white_image.style.transform = "rotate(-10deg)";
   dayname_white_image.style.left = _weekday_x + 18 + "px";
   dayname_white_image.style.top = _weekday_y + 2 + "px";

   dayname_black_image.style.position = "absolute";
   dayname_black_image.style.transform = "rotate(-10deg)";
   dayname_black_image.style.left = _weekday_offsetx + 15 + "px";
   dayname_black_image.style.top = _weekday_offsety + 3 + "px";

   dayname_image.style.position = "absolute";
   dayname_image.style.transform = "rotate(-10deg)";
   dayname_image.style.left = _weekday_displayoffsetx + 13 + "px";
   dayname_image.style.top = _weekday_displayoffsety + 3 + "px";

   break;
   default:
   dayname_white_image.src = Calendar.Folder + 'DayName/Japanese/' + 'BaseWhite_Tuesday' + '.png';
   dayname_black_image.src = Calendar.Folder + 'DayName/Japanese/' + 'BaseBlack_Tuesday' + '.png';
   dayname_image.src = Calendar.Folder + 'DayName/Japanese/' + 'Tuesday' + '.png';

   _weekday_offsetx = weekday_x + 10;
   _weekday_offsety = weekday_y + 23 + 15;
   _weekday_displayoffsetx = weekday_x + 15;
   _weekday_displayoffsety = weekday_y + 26 + 15;

   dayname_white_image.style.position = "absolute";
   dayname_white_image.style.transform = "rotate(-10deg)";
   dayname_white_image.style.left = _weekday_x + 6 + "px";
   dayname_white_image.style.top = _weekday_y + 15 + "px";

   dayname_black_image.style.position = "absolute";
   dayname_black_image.style.transform = "rotate(-10deg)";
   dayname_black_image.style.left = _weekday_offsetx - 1 + "px";
   dayname_black_image.style.top = _weekday_offsety - 8 + "px";

   dayname_image.style.position = "absolute";
   dayname_image.style.transform = "rotate(-10deg)";
   dayname_image.style.left = _weekday_displayoffsetx - 5 + "px";
   dayname_image.style.top = _weekday_displayoffsety - 15 + "px";
   break;
 }

 if(Calendar.Theme == 0)
 {
   dayname_white_image.style.filter = 'invert(0)';
   dayname_black_image.style.filter = 'invert(0)';
   dayname_image.style.filter = 'invert(0)';
 }
 else
 {
   dayname_white_image.style.filter = 'invert(1)';
   dayname_black_image.style.filter = 'invert(1)';
   if(Calendar.DayofWeek != "Saturday" && Calendar.DayofWeek != "Sunday")
   dayname_image.style.filter = 'invert(1)';
   else
   dayname_image.style.filter = 'invert(0)';
 }

}

function setTimeofDayEnglish(){
  const timename_image = document.getElementById('timename');
 switch(Calendar.TimeofDay){
   case "Early Morning":
   timename_image.src = Calendar.Folder + 'TimeName/' + 'EarlyMorning' + '.png';
   timename_image.style.position = "absolute";
   timename_image.style.transform = "rotate(-20deg) scale(0.8)";
   timename_image.style.left = -57 + "px";
   timename_image.style.top = 130 + "px";
   break;
   case "Morning":
   timename_image.src = Calendar.Folder + 'TimeName/' + 'Morning' + '.png';
   timename_image.style.position = "absolute";
   timename_image.style.transform = "rotate(-20deg) scale(0.8)";
   timename_image.style.left = -57 + "px";
   timename_image.style.top = 130 + "px";
   break;
   case "Afternoon":
   timename_image.src = Calendar.Folder + 'TimeName/' + 'Afternoon' + '.png';
   timename_image.style.position = "absolute";
   timename_image.style.transform = "rotate(-20deg) scale(0.8)";
   timename_image.style.left = -57 + "px";
   timename_image.style.top = 130 + "px";
   break;
   case "DayTime":
   timename_image.src = Calendar.Folder + 'TimeName/' + 'Daytime' + '.png';
   timename_image.style.position = "absolute";
   timename_image.style.transform = "rotate(-20deg) scale(0.8)";
   timename_image.style.left = -57 + "px";
   timename_image.style.top = 130 + "px";
   break;
   case "Evening":
   timename_image.src = Calendar.Folder + 'TimeName/' + 'Evening' + '.png';
   timename_image.style.position = "absolute";
   timename_image.style.transform = "rotate(-20deg) scale(0.8)";
   timename_image.style.left = -57 + "px";
   timename_image.style.top = 130 + "px";
   break;
   default:
 }
}

function setTimeofDayJapanese(){
  const timename_image = document.getElementById('timename');
 switch(Calendar.TimeofDay){
   case "Morning":
   timename_image.src = Calendar.Folder + 'TimeKanji/' + 'Morning' + '.png';
   timename_image.style.position = "absolute";
   timename_image.style.transform = "rotate(-20deg)";
   timename_image.style.left = + 9 + "px";
   timename_image.style.top = 165 + "px";
   break;
   case "BeforeNoon":
   timename_image.src = Calendar.Folder + 'TimeKanji/' + 'BeforeNoon' + '.png';
   timename_image.style.position = "absolute";
   timename_image.style.transform = "rotate(-20deg)";
   timename_image.style.left = + 20 + "px";
   timename_image.style.top = 165 + "px";
   break;
   case "DayTime":
   timename_image.src = Calendar.Folder + 'TimeKanji/' + 'Daytime' + '.png';
   timename_image.style.position = "absolute";
   timename_image.style.transform = "rotate(-20deg)";
   timename_image.style.left = + 7 + "px";
   timename_image.style.top = 165 + "px";
   break;
   case "Night":
   timename_image.src = Calendar.Folder + 'TimeKanji/' + 'Night' + '.png';
   timename_image.style.position = "absolute";
   timename_image.style.transform = "rotate(-20deg)";
   timename_image.style.left = + 10 + "px";
   timename_image.style.top = 160 + "px";
   break;
   case "LateNight":
   timename_image.src = Calendar.Folder + 'TimeKanji/' + 'LateNight' + '.png';
   timename_image.style.position = "absolute";
   timename_image.style.transform = "rotate(-20deg)";
   timename_image.style.left = + 8 + "px";
   timename_image.style.top = 160 + "px";
   break;
   default:
 }
}

function getWeather(){
let url = `https://api.openweathermap.org/data/2.5/weather?q=${Calendar.Location}&appid=${Calendar.Key}&units=metric`;
let flag = 0;
fetch(url)
.then(result=>result.json())
.then(data=>{
  if(Calendar.Weather.Main != data.weather[0].main)
  Calendar.Weather.Frame = 0;
  Calendar.Weather.Main = data.weather[0].main;
  Calendar.Weather.FeelsLike = data.main.feels_like;
  Calendar.Weather.MainTemp = data.main.temp;
  Calendar.Weather.Description = data.weather[0].description;
  Calendar.Weather.IconID = data.weather[0].icon;
  Calendar.Weather.WebID = data.id;
  document.getElementById("wref").href = `https://openweathermap.org/city/${Calendar.Weather.WebID}`;
  if(Calendar.Weather.Main.includes("Tornado"))
  {
    Calendar.Weather.Alert = "TyphoonWarning";
    flag = 1;
  } //tornado

  if((Calendar.Weather.Main.includes("Thunderstorm") || Calendar.Weather.Description.includes("Drizzle") || Calendar.Weather.Description.includes("Rain")) && flag == 0)
   {
      if(Calendar.Weather.Description.includes("heavy") || Calendar.Weather.Description.includes("extreme"))
      {
        Calendar.Weather.Alert = "TorrentialRain";
        flag = 1;
      }
    }
   if((Calendar.Month == 1 || Calendar.Month == 2 || Calendar.Month == 10 || Calendar.Month == 11 || Calendar.Month == 12) && flag == 0)
  {
   Calendar.Weather.Alert = "FluSeason";
   flag = 1;
  }

  if((Calendar.Month == 3 || Calendar.Month == 4) && flag == 0)
  {
  Calendar.Weather.Alert = "PollenWarning";
  flag = 1;
  }

  if((Calendar.Weather.MainTemp >= 30 && Calendar.Weather.IconID.includes("d")) && flag == 0)
  {
   Calendar.Weather.Alert = "HeatWave";
   flag = 1;
  }

  if((Calendar.Weather.MainTemp >= 30 && Calendar.Weather.IconID.includes("n")) && flag == 0)
  {
   Calendar.Weather.Alert = "HotNight";
   flag = 1;
  }
  if(flag = 0)
   Calendar.Weather.Alert = "None";
   setWeather();

  })
  .catch(() => {
    Calendar.Weather.Icon = "loading.gif";
    Calendar.Weather.Alert = "None";
    setWeatherError();
  });
}
function setWeather(){
  const white_weather_image = document.getElementById('white_weather');
  const weather_image = document.getElementById('weather');
  const alert_image = document.getElementById('alert');
  switch(Calendar.Weather.Main){
    case "Clear":
    Calendar.Weather.Icon = "Sunny";
    break;
    case "Clouds" || "Mist" || "Smoke" || "Haze" || "Dust" || "Fog" || "Sand" || "Ash" || "Squall" || "Tornado":
    Calendar.Weather.Icon = "Cloudy";
    break;
    case "Rain" || "Drizzle" || "Thunderstorm":
    Calendar.Weather.Icon = "Rainy";
    break;
    case "Snow":
    Calendar.Weather.Icon = "Snow"
    break;
    default:
    if(Calendar.Weather.Icon != "loading.gif")
      Calendar.Weather.Icon = "Cloudy";
  }

  weather_image.style.display = "inline";
  alert_image.style.display = "inline";
  weather_image.style.transform = "scale(1)";

  if(Calendar.Day > 9)
  {
  white_weather_image.src = Calendar.Folder + "Weather/" + "Weather_Base_White" + ".png";
  white_weather_image.style.position = "absolute";
  white_weather_image.style.left = 195 + "px";
  white_weather_image.style.top = 3 + "px";

  weather_image.src = Calendar.Folder + "Weather/" + Calendar.Weather.Icon + "_" + Calendar.Weather.Frame + ".png";
  weather_image.style.position = "absolute";
  weather_image.style.left = 210 + "px";
  weather_image.style.top = 15  + "px";

  if(Calendar.Weather.Alert != "None")
  {
  alert_image.src = Calendar.Folder + "Weather/" + Calendar.Weather.Alert + ".png";
  alert_image.style.position = "absolute";
  alert_image.style.left = 210 + "px";
  alert_image.style.top = 130  + "px";
  }

  }
  if(Calendar.Day < 10){
    white_weather_image.src = Calendar.Folder + "Weather/" + "Weather_Base_White" + ".png";
    white_weather_image.style.position = "absolute";
    white_weather_image.style.left = 148 + "px";
    white_weather_image.style.top = 7 + "px";

    weather_image.src = Calendar.Folder + "Weather/" + Calendar.Weather.Icon + "_" + Calendar.Weather.Frame + ".png";
    weather_image.style.position = "absolute";
    weather_image.style.left = 163 + "px";
    weather_image.style.top =  19 + "px";

    if(Calendar.Weather.Alert != "None")
    {
      alert_image.src = Calendar.Folder + "Weather/" + Calendar.Weather.Alert + ".png";
      alert_image.style.position = "absolute";
      alert_image.style.left = 210 + "px";
      alert_image.style.top = 130  + "px";
    }

  }

}
function setWeatherError()
{
  const weather_image = document.getElementById('weather');
  weather_image.src = Calendar.Folder + "Weather/" + Calendar.Weather.Icon;
  if(Calendar.Day > 9)
  {
    weather_image.style.position = "absolute";
    weather_image.style.transform = "scale(1.5)";
    weather_image.style.left = 250 + "px";
    weather_image.style.top = 15  + "px";

  }
  if(Calendar.Day < 10)
  {
    weather_image.style.position = "absolute";
    weather_image.style.transform = "scale(1.5)";
    weather_image.style.left = 203 + "px";
    weather_image.style.top =  19 + "px";
  }
}

function animation()
{
 if(Calendar.Weather.Icon != "loading.gif" && document.getElementById("weather") != null && Calendar.Key != null && Calendar.Key != undefined && Calendar.Key != "none" && Calendar.Key != "None" && Calendar.Key != "")
 {
 Calendar.Weather.Frame = Calendar.Weather.Frame + 1;
 if(Calendar.Weather.Frame > 2)
 Calendar.Weather.Frame = 0;
 document.getElementById("weather").src = Calendar.Folder + "Weather/" + Calendar.Weather.Icon + "_" + Calendar.Weather.Frame + ".png";
 }
}
