mcr.docRoot = 'public/';
mcr.load();

describe('mcr.backend', function () {

    beforeEach(function() {
        mcr.reset();
        var done = false;

        runs(function(){
            mcr.ready.done(function() {
                done = true;
            });
        });

        waitsFor(function(){
            return done;
        });

    });

    describe('add', function () {
        it('maintains workspace', function () {
            var result = mcr.add('H');
            expect(result.workspace).toEqual(['H']);
            result = mcr.add('H');
            expect(result.workspace).toEqual(['H', 'H']);
        });

        it('finds water when given hho', function () {
            mcr.add('H');
            mcr.add('H');
            var result = mcr.add('O');

            var expected = [
                {
                    "name":"Water",
                    "group": "covalent",
                    "elements":{
                        "H":2,
                        "O":1
                    }
                }
            ];
            expect(result.discovered).toEqual(expected);
        });

        it('finds nothing when no match', function () {
            mcr.add('H');
            var result = mcr.add('O');

            expect(result.discovered).toEqual([]);
        });

        it('potential will return # of possible matches', function() {
            mcr.add('H');
            var result = mcr.add('O');

            expect(result.potential).toEqual(1);
        });

    });
});

