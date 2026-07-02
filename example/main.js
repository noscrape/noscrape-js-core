import { Noscrape } from '../dist';

const noscrape = new Noscrape({
    debug: true,
});

await noscrape.render();
