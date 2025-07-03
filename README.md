# Why?

2x? 1x? Doesn't matter? 3x? A lot of discussions and opinions. Here - only numbers and graphs.

# How to
## Manually
Type in chainring(s) and back cassette size (separated by ___, - : ;___), 
add (optional) set name. 
Adding one or more set to the list draws all tables and graphics.

## Semi-Automatically 
Sets to compare could be encoded in URL, eg.:
[http://whatratio.com/?sets=grx%20400_f-30,46_b-32,28,25,22,20,18,16,14,12,11;SRAM%20Apex%201_f-40_b-11,12,13,15,17,19,21,24,28,32,38,44&ecc=1&o=4](http://whatratio.com/?sets=grx%20400_f-30,46_b-32,28,25,22,20,18,16,14,12,11;SRAM%20Apex%201_f-40_b-11,12,13,15,17,19,21,24,28,32,38,44&ecc=1&o=4)

here:
* `sets=` - array of Ratios to compare. In this example it's:
  *  _grx%20400_f-30,46_b-32,28,25,22,20,18,16,14,12,11_ <br/> `grx%20400` - name (%20 is space) <br/> `f-30,46` - front chainring(s) <br/> `b-32,28,25,22,20,18,16,14,12,11` - rear cassette  
  *  _SRAM%20Apex%201_f-40_b-11,12,13,15,17,19,21,24,28,32,38,44_ <br/> `SRAM%20Apex%201` - name (%20 is space) <br/> `f-40` - front chainring(s) <br/> `b-11,12,13,15,17,19,21,24,28,32,38,44` - rear cassette
* `ecc=` - exclude cross-chained gears from usable gear list?
  * `1` - yes
  * `0` - no
* `o=` - Overlap percentage (`1` to `10`). How close should be two gears, for them to be considered "basically same"  

