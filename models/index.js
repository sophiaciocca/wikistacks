var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {logging: false});

//define our two models
var Page = db.define('page', { //actually should've just said 'pages' -- database will make it plural anyway
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: true
    }, 
    content: {
        type: Sequelize.TEXT,
        allowNull: false,
        get: function () {
            return marked(content);
        }
    },
    status: {
        type: Sequelize.ENUM('open', 'closed')
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        set: function(str) { //"setter" -- takes value that page.tags is trying to be set to, and does something to it
            var arrayOfTags;
            if (typeof str === 'string') {
                arrayOfTags = value.split(',').map(function(s) {
                    return s.trim();
                });
                this.setDataValue('tags', arrayOfTags);
            }
            else {
                this.setDataValue('tags', arrayOfTags);
            }
        }
    }
    
}, { getterMethods: { //this is a "virtual" -- we're creating a pseudo-property, route, that we can use, even tho it's not in the database. it's based off a diff proprety in DB (here, urlTitle)
        route: function() {
            return '/wiki/' + this.urlTitle;
        }
    },
    instanceMethods: {
        
        findSimilar: function () {
            return Page.findAll({
                where: {
                    tags: {
                        $overlap: this.tags
                    }
                }
            })
        }

    },
    virtuals : {
        getBattleCry : function() {
            return '${this.name} will munch on your boooonesssss!'
        }
    }
    classMethods: {
        
        findByTag: function (tag) {
            return Page.findAll( {
                where: {
                    tags: {
                        $overlap: [tag] //see sequelize documentation for this
                    },
                    id: {
                        $ne: this.id //sequelize operator: 'not equal' to this.id
                    }
                }
            })
        }

    }
});

//hook for Pages: this fills in URL field from one of the other fields
//hooks in general: does something before/after validating; could be doing a function(like here), could just be console logging something, etc.
Page.hook('afterValidate', function(page, options) {
    page.urlTitle = createUrlTitle(page.title);
});

//connect Pages & Users (a sequelize autocreation of joint tables)
Page.belongsTo(User, { as: 'author' }); //this could be Page.hasMany(User) if that was the correct relationship

var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        isEmail: true // might need validate: {isEmail: true}
    }
});

module.exports = {
    Page: Page,
    User: User,
    db: db
};

function createUrlTitle(title) {
    if(title) {
        var urlTitle = title.replace(/\s+/g, '_').replace(/\W/g, '');
    }
    else {
        var alphaNum = "abcdefghijklmnopqrstuvwxyz0123456789";
        var urlTitle = "";
        for (var i = 0; i < 10; i++) {
            urlTitle += alphaNum[Math.floor(Math.random() * 36)];
        }
    }
    return urlTitle;
}