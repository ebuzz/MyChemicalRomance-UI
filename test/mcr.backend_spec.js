mcr.docRoot = 'public/';
mcr.load();

describe('mcr.backend', function () {

    var water = [
        {
            "name":"Water",
            "group": "covalent",
            "elements":{
                "H":2,
                "O":1
            }
        }
    ];

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

        it('finds water when given HHO', function () {
            mcr.add('H');
            mcr.add('H');
            var result = mcr.add('O');

            expect(result.discovered).toEqual(water);
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

    describe('remove', function() {
        it('should be able to recognize water if we add a NOHH then remove N', function() {
            mcr.add('N');
            mcr.add('O');
            mcr.add('H');
            var result = mcr.add('H');

            expect(result.discovered).toEqual([]);

            result = mcr.remove('N');

            expect(result.discovered).toEqual(water);
        });
    });
});

