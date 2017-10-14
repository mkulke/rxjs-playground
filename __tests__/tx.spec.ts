import { Observable } from 'rxjs/Rx';
import { _performTx } from '../tx';

describe('_performTx', () => {
  const client: any = {
    startTx: () => Observable.of('START'),
    endTx: () => Observable.of('END'),
    abortTx: () => Observable.of('ABORT'),
    insert: () => Observable.of('INSERT'),
  };

  it('starts a tx', done => {
    const chunks$ = Observable.from([]);

    _performTx(chunks$, client)
      .first()
      .subscribe(
        value => expect(value).toBe('START'),
        done,
        done,
      );
  });

  it('ends a tx', done => {
    const chunks$ = Observable.from([]);

    _performTx(chunks$, client)
      .last()
      .subscribe(
        value => expect(value).toBe('END'),
        done,
        done,
      );
  });

  it('inserts', done => {
    const chunks$ = Observable.from([
      [ { id: 1 }, { id: 2} ],
      [ { id: 2 }, { id: 3} ],
    ]);

    _performTx(chunks$, client)
      .filter((val: any) => val === 'INSERT')
      .toArray()
      .do(inserts => {
        expect(inserts).toHaveLength(2);
      })
      .subscribe(
        undefined,
        done,
        done,
      );
  });

  it('aborts a tx on error', done => {
    const chunks$: any = Observable.from([
      [ { id: 1 }, { id: 2 }, 'ILLEGAL' ],
    ]);

    _performTx(chunks$, client)
      .last()
      .subscribe(
        value => expect(value).toBe('ABORT'),
        () => done(),
        undefined,
      );
  });
});
