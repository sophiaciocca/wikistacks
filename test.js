const Giraffe = require('./models').Giraffe;
const expect = require('chai').expect;

describe('Giraffe app', function() {
    //All app tests

    describe ('model', function() {
        //before hook:
        before(function(done) {
            Giraffe.sync({force: true})
            .then(function() {
                done();
            })
            .catch(function(err) {
                done(err)
            });
        });
    });

    //instance methods
    describe('instance method', function() {
        it('takes no args and returns string', function() {
            const g = Giraffe.build({});
        const neck = g.eatAcacia()
        expect(neck).to.be.a('string');
        });
        it('will eat acacia based on neck length', function() {
            const little = Giraffe.build({neckLength : 0.2});
            const big = Giraffe.build( {neckLength : 0.9});
            
            const lresult = little.eatAcacia();
            const bresult = big.eatAcacia();

            expect(lresult).to.equal('sooo hungry');
            expect(bresult).to.equal('yummyyy');
        });
    });

    describe('class methods', function() {
        describe('find shorties', function() {
            it('takes no args and returns array', function(done) {
                const promise = Giraffe.findShorties()
                    .then(function(giraffes) {
                        expect(giraffes).to.be.an('array');
                        done();
                    })
                    .catch(function(err) {
                        done(err);
                    })
            });

            it('returns true', function() {
                expect(true).to.equal(true);
            });
        })
    })

})