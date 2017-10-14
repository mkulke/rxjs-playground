import { chunks$ } from './chunk';
import { update } from './tx';
import { dropDuplicates } from './dropDuplicates';

chunks$
  .take(3)
  .let(dropDuplicates)
  .let(update)
  .subscribe();

chunks$
  .let(update)
  .subscribe();
