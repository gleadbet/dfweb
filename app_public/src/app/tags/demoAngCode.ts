

Demo with two diff Y-Axis Values
Complete Example:
<!DOCTYPE html>
<HTML lang="en">
<HEAD>
    <meta charset="UTF-8">
    <TITLE>Crunchify - Dynamic Spline HighChart Example with Multiple Y Axis</TITLE>
    <meta name="description" content="Crunchify - Dynamic Spline HighChart Example with Multiple Y Axis.">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<script type="text/javascript"
    src="https://code.jquery.com/jquery-1.10.1.min.js"></script>
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<style type="text/css">
body {
    background-image:
        url('https://crunchify.com/bg.png');
}
p {
    width: 70%;
}
</style>
<script>
    $(function() {
        $(document)
            .ready(
                function() {
                    Highcharts.setOptions({
                        global : {
                            useUTC : false
                            }
                    });
                    var chart;
                    $('#container').highcharts(
                        {
                        chart : {
                            type : 'spline',
                            animation : Highcharts.svg, // don't animate in old IE
                            marginRight : 10,
                            events : {
                                load : function() {
                                    // set up the updating of the chart each second
                                    var series = this.series[0];
                                    var series2 = this.series[1];
                                    setInterval(
                                        function() {
                                            var x = (new Date()).getTime(), // current time
                                                y = Math.floor((Math.random() * 100) + 1);
                                                z = Math.floor((Math.random() * 30) + 1);
                                            series.addPoint([x,y ],
                                                false, true);
                                            series2.addPoint([x,z ],
                                                true,
                                                true);
                                        }, 1000);
                                }
                            }
                        },
                        title : {
                            text : 'Live random data - Two diff. Y Axis values - Crunchify Tutorial'
                            },
                            xAxis : {
                                type : 'datetime',
                                tickPixelInterval : 150
                            },
                            yAxis : [ {
                                title : {
                                    text : 'yAxis-1'
                                },
                                plotLines : [ {
                                    value : 0,
                                    width : 1,
                                    color : '#808080'
                                    } ]
                                }, {
                                    title : {
                                    text : 'yAxis-2'
                                    },
                                    plotLines : [ {
                                        value : 0,
                                        width : 1,
                                        color : '#808080'
                                    } ]
                                } ],
                                tooltip : {
                                    formatter : function() {
                                                return '<b>'+ this.series.name + '</b><br/>' + Highcharts.dateFormat(
                                                                                '%Y-%m-%d %H:%M:%S',
                                                                                this.x)+ '<br/>' + Highcharts.numberFormat(this.y,2);
                                                }
                                },
                                legend : {
                                    enabled : false
                                },
                                exporting : {
                                    enabled : false
                                    },
                                    series : [
                                        {
                                        name : 'Random data - yAxis-1',
                                        data : (function() {
                                                    // generate an array of random data
                                                    var data = [], time = (new Date()).getTime(), i;
                                                    for (i = -19; i <= 0; i++) {
                                                        data.push({x : time + i * 1000, y : Math.floor((Math.random() * 100) + 1)
                                                        });
                                                    }
                                                return data;
                                                })()
                                        },
                                                        {
                                                            name : 'Random data - yAxis-2',
                                                            data : (function() {
                                                                // generate an array of random data
                                                                var data = [], time = (new Date())
                                                                        .getTime(), i;
                                                                for (i = -19; i <= 0; i++) {
                                                                    data
                                                                            .push({
                                                                                x : time
                                                                                        + i
                                                                                        * 1000,
                                                                                y : Math.floor((Math.random() * 30) + 1)
                                                                            });
                                                                }
                                                                return data;
                                                            })()
                                                        } ]
                                            });
                        });
    });
</script>
</HEAD>
<BODY>
    <div id="container"
        style="min-width: 728px; height: 400px; margin: 0 auto"></div>
    <br>
    <div align="center">
    <h1>Part of Crunchify Tutorial Series...</h1>
     
        <div
            style="font-family: verdana; padding: 10px; border-radius: 10px; border: 3px solid #EE872A; width: 50%; font-size: 12px;">
            Simple Spline HighChart Example by <a href='https://crunchify.com'>Crunchify</a>.
            Click <a
                href='https://crunchify.com/category/java-tutorials/'>here</a>
            for all Java, Spring MVC, Web Development examples.<br>
        </div>
    </div>
</BODY>
</HTML>
Another must read: JavaScript to Validate Email & Password Fields on Form Submit Event

Below is a sample HTML code:
<HTML>
<HEAD>
<TITLE>Crunchify - Dynamic Spline HighChart Example with
    Multiple Y Axis</TITLE>
<script type="text/javascript"
    src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
<script src="http://code.highcharts.com/highcharts.js"></script>
<script src="http://code.highcharts.com/modules/exporting.js"></script>
<script>
.....above script goes here....
</script>
</HEAD>
<BODY>
    <div id="container"
        style="min-width: 728px; height: 400px; margin: 0 auto"></div>
</BODY>
</HTML>
Let me know if you face any issue running this tutorial.

If you liked this article, then please share it on social media. Have a question or suggestion? Please leave a comment to start the discussion.


AD
Suggested Articles...
How to Generate Random Number in Java with Some Variations?
Some of my Favorite JavaScript Tips and Tricks Tutorials
My Favorite 5 JavaScript Canvas Libraries – HTML5
How to install Ansible on Linux Ubuntu OS?
In Java How to Find Maximum Occurrence of Words from Text File?
How to Update Sparkline Graph Every 3 Seconds in Spring MVC (Realtime Update)
JavaScript and jQuery Tutorials AJAX Tutorials

GIVE ME A TRY...
10 Best Mac Apps WordPress Security SEO Basics Optimize WP ChatGPT

About App
I'm an Engineer by profession, Blogger by passion & Founder of Crunchify, LLC, the largest free blogging & technical resource site for beginners. Love SEO, SaaS, #webperf, WordPress, Java. With over 16 millions+ pageviews/month, Crunchify has changed the life of over thousands of individual around the globe teaching Java & Web Tech for FREE.

Subscribe To Newsletter...
Stay up to date & never miss an update! Signup for news, latest articles, special offers & Join 16+ million monthly readers 👋

Email Address
Email Address
 Subscribe!
Reader Interactions
  16 Comments...
Maggie says

Jul 31, 2017 at 12:45 pm

What if instead of updating the chart with random data i would like to update the highchart with the json data coming from url displaying it on highchart after 1 sec interval.

Reply
App Shah says

Aug 15, 2017 at 3:22 pm

Hi Maggie – you could absolutely do that. Here would be the flow:

1. Make HTTP GET call to get JSON data
2. Parse data
3. Substitute those values with x and y value

Reply
alex says

May 5, 2016 at 5:32 am

i’m struggling to use tis example but reading recorded values from a csv. been looking for ages for examples of csv data and realtime update but to no avail.

Reply
App Shah says

May 20, 2016 at 11:52 am

Hi Alex – didn’t get your question clearly. Do you want to update graph in realtime with CSV data? Who updates CVS data in realtime? Do you have sample CSV file?

Reply
alex says

May 20, 2016 at 1:30 pm

Well Shah, the arduino yun makes the csv/txt file with values read in realtime from a ct. sensor. It has to display three values: voltage(optional), wattage and amps. I did all the part on the arduino side, but i’m stuck at the highcharts plotting the content of the csv file with a rate of one read/second. The output format is something like 245Volts,8.6Amps,1999Watts

Reply
App Shah says

May 21, 2016 at 11:07 am

Got it Alex. How about replacing y = Math.random(); z = Math.random(); with values from CSV file?

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "crunchify.txt",
        dataType: "text",
        success: function(data) {crunchifyData(data);}
     });
});
function crunchifyData(myValue) {
    var crunchify_num = 1; 
    var allTextmylines = myValue.split(/rn|n/);
    var crunchify_entries = allTextmylines[0].split(',');
    var mylines = [];
    var headings = crunchify_entries.splice(0,crunchify_num);
    while (crunchify_entries.length>0) {
        var tarr = [];
        for (var j=0; j<crunchify_num; j++) {
            tarr.push(headings[j]+":"+crunchify_entries.shift());
        }
        mylines.push(tarr);
    }
    // alert(mylines);
}
Reply
alex says

May 22, 2016 at 12:33 pm

Thanks Shah, i’ll give your proposal a try.

App Shah says

Jun 6, 2016 at 10:43 am

Sure. Let me know if that works for you.

alex says

May 24, 2016 at 4:59 am

Hello Shah, i’ve tried the suggested code, but it isn’t working. I did a virtual server too to run the index file.
Here’s the adapted code:

Crunchify – Dynamic Spline HighChart Example with
Multiple Y Axis

$(document).ready(function() {
$.ajax({
type: "GET",
url: "crunchify.txt",
dataType: "text",
success: function(data) {crunchifyData(data);}
});
});
function crunchifyData(myValue) {
var crunchify_num = 1; 
var allTextmylines = myValue.split(/rn|n/);
var crunchify_entries = allTextmylines[0].split(',');
var mylines = [];
var headings = crunchify_entries.splice(0,crunchify_num);
while (crunchify_entries.length>0) {
var tarr = [];
for (var j=0; j<crunchify_num; j++)="" {="" tarr.push(headings[j]+":"+crunchify_entries.shift());="" }="" mylines.push(tarr);="" }="" alert(mylines);="" }=""
and the crunchify.txt has this format:

volts,amps,watts
626,505,431
625,515,456
626,505,431
625,515,456
626,505,431
Lakshmi kanth says

Oct 5, 2015 at 2:08 am

Hi, Nice post. I have small query.
I have two y-axis with different range (example : 1st y-axis 0-100 and 2nd 30-80).
when i used your solution it was taking only one y-axis as a reference and other gets ignored.
Can i have any solution on this.

Reply
App Shah says

Oct 22, 2015 at 3:50 pm

Hi Lakshmi – i’ll take a look and update may be during weekend.

Reply
App Shah says

Oct 23, 2015 at 12:44 pm

Hi Lakshmi – I have updated above tutorial which has now another demo link with two different Y-Axis values.

Basically you need to make changes at below 4 locations as per your need. It’s just javascript Math function. Modify at per your need.

y = Math.floor((Math.random() * 100) + 1);
z = Math.floor((Math.random() * 30) + 1);
y : Math.floor((Math.random() * 100) + 1)
y : Math.floor((Math.random() * 30) + 1)
Reply
Aron Eduardo says

Jul 10, 2015 at 10:11 am

how could I apply this to a database ?

Reply
App Shah says

Jul 17, 2015 at 11:34 am

Hi Aron – can you explain in details your query?

Reply
snake says

Oct 21, 2013 at 10:29 pm

var x = (new Date()).getTime(), // current time
y = ???; // as here we substitute the value of div? values ​​change

Reply
praveen kumar says

Jun 18, 2013 at 3:26 am

Hi App,
Your post was very helpful. However, i have a question. If i want to load the series data from a java function, how would i do that? Im a novice and your patience would be much appreciated.
