const express = require('express'),
      router = express.Router();
      const { ensureAuthenticated } = require('../config/auth');

      const Artisan = require('../model/Artisan');
    

router.get('/', (req, res) => {

    res.render('index');

})

router.get('/pricing', (req, res) => {

    res.render('pricing');

})

router.get('/search', (req, res) => {
res.render('search')
});

router.get('/dashboard', ensureAuthenticated, (req,res)=>{

        Artisan.find({username:req.user.username}, function(err, record){
            if(err){
                console.log(err);
                res.send('There is an issue')
            }
            else{
                 console.log({record})
                console.log(req.user.username)
                res.render('dashboard', {record,username:req.user.username})
            }
        })

})



router.get('/edit/:pid', (req, res) => {
    Artisan.find({_id:req.params.pid}, (error, record) => {
                if (error) {
                    req.flash('error_msg', "Could not query database")
                    res.redirect('/edit/:pid');
                } else {
                    res.render('edit', {record, username:req.user.username});
                }
            })
});



router.post('/edit/:pid', (req, res) => {
    
            const {cName, cNumber,cEmail, bName, cacStatus, title, staffStrength, 
        address, city, website, username, password,password2,date} = req.body;

            Artisan.updateOne({_id:req.params.pid}, {$set:{cName, cNumber,cEmail, bName,  title, 
                 address, website, username, date}}, (err, record) => {
                if (err) {
                    req.flash('error_msg', "Could not update Artisan details");
                    res.redirect('/edit/:pid');
                } else {
                    req.flash('message', "Artisan successfully updated");
                    res.redirect('/dashboard')
                }
            })
        })

router.post('/', (req,res)=>{
    let what = req.body.what;
    let where = req.body.where;

        Artisan.find({title:what, city:where}, function(err, result){
            if(err){
                console.log(err);
                res.send('There is an issue')
            }
            else{
                console.log({record:result})
                res.render('search', {record:result,what:what,where:where})
            }
        })

})

router.get('/:pid', (req, res) => {
        
         Artisan.deleteOne({_id:req.params.pid}, (error, record) => {
            if (error) {
                req.flash('error_msg', "Could not query database")
            } else {
                req.flash('success_msg', "Artisan deleted successfully");
                res.redirect('/')
            }
        })
})

module.exports=router; 