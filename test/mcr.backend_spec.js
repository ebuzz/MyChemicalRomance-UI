mcr.compoundsUrl = 'test/json/compounds.json';
mcr.elementsUrl = 'test/json/elements.json';
mcr.load();

describe('mcr.backend', function () {

    function addH2O() {
        mcr.add('H');
        mcr.add('H');
        return mcr.add('O');
    }

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
            expect(addH2O().discovered).toEqual(water);
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

        it('potential will decrement after compound found', function() {
            addH2O();

            mcr.clearWorkspace();

            var result = mcr.add('H');

            expect(result.potential).toBe(0);
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

    describe('previous discoveries', function() {

        beforeEach(function() {

        });

        it('should not allow me to discover previous discoveries', function() {
            var result = addH2O();

            expect(result.discovered).toEqual(water);

            mcr.clearWorkspace();

            result = addH2O();

            expect(result.discovered).toEqual([]);
        });
    });

    describe('undiscovered compounds', function() {
        it('should return the current potentially undiscovered compound count when taking the workspace into consideration', function() {
            expect(mcr.undiscoveredCompounds()).toBe(2);
        });

        it('should return 1 undiscovered compound after H2O is discovered', function() {
            addH2O();

            mcr.clearWorkspace();

            expect(mcr.undiscoveredCompounds()).toBe(1);
        });
    });

    describe('discovered compounds', function() {
        it('should return a list of compounds for a given group', function() {
            addH2O();
            mcr.clearWorkspace();
            
            var result = mcr.discoveredCompounds('covalent');

            expect(result).toEqual(water);
        })
    })
});

