var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {logging: false});

//define our two models
var Page = db.define('page', {
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
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed')
    },
    // date: {
    //     type: Sequelize.DATE,
    //     defaultValue: Sequelize.NOW
    // },
    
}, { getterMethods: {
        route: function() {
            return '/wiki/' + this.urlTitle;
        }
    }
});

Page.hook('afterValidate', function(page, options) {
    page.urlTitle = createUrlTitle(page.title);
});

Page.belongsTo(User, { as: 'author'});

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
}

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