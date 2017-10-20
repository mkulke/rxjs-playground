import { chunks$ } from './chunk';
import { dropDuplicates } from './dropDuplicates';
import { update } from './tx';

chunks$
  .take(3)
  .let(dropDuplicates)
  .let(update)
  .subscribe();

chunks$.let(update).subscribe();
