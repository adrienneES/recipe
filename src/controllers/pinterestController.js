const pinterestController = () => {
    import pinterestAPI from 'pinterest-api';
    const pinterest = pinterestAPI('adricurtis');
    var pinData;
    const getPins = (req,res ) => {
        // Get pins from a board (second parameter determines whether you want the results paginated and to include some metadata)
        pinterestAPI.getDataForPins('833658580996442221',  (pins) => {
            console.log(pins.domain);
            if (pins.length == 1) {
              let obj = pin.repin_count;
              console.log(obj);
              res.send(obj);
          }
          else {
            res.send(pins.data);
        }
        });
        // Get data for pins (note that this is a static method (a method of the class itself) since it does not rely on any state)
        //pinterestAPI.getDataForPins(['833658580996442219'], function (data) {
        //  res.send(data);
        //  console.log(data);
        //});//
        //res.send(pinData);
    
    }
    

    return {
        getPins : getPins
        
    };
}
module.exports = pinterestController;