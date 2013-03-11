#!/bin/sh

#  build.sh
#
#  Created by Ben Voß on 2013-03-02.
#
tsc --declaration --comments --out Code/jsBind.js Code/src/jsBind.ts
uglifyjs Code/jsBind.js -o Code/jsBind.min.js

cp Code/jsBind.d.ts Code/examples/jsBind.d.ts

tsc --comments --out Code/examples/js/calc.js Code/examples/calc.ts
tsc --comments --out Code/examples/js/clock.js Code/examples/clock.ts
tsc --comments --out Code/examples/js/tableDemo.js Code/examples/tableDemo.ts
tsc --comments --out Code/examples/js/tabs.js Code/examples/tabs.ts

tsc --comments --out Code/tests.js Code/tests/tests.ts

cp Code/jsBind.js WebSite/jsBind/js/jsBind.js
cp Code/jsBind.min.js WebSite/jsBind/js/jsBind.min.js
cp Code/jsBind.min.js Code/examples/js/jsBind.min.js

cp Code/examples/js/tabs.js WebSite/jsBind/js/tabs.js
cp Code/examples/js/calc.js WebSite/jsBind/js/calc.js
cp Code/examples/js/clock.js WebSite/jsBind/js/clock.js
cp Code/examples/js/tableDemo.js WebSite/jsBind/js/tableDemo.js
cp Code/examples/js/tabs.js WebSite/jsBind/js/tabs.js
