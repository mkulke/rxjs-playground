import { Observable } from 'rxjs/Rx';
import { _performTx, _buildQueries } from '../tx';

describe('_buildQueries', () => {
  it('omits empty chunks', done => {
    const chunks$ = Observable.from([
      [{ id: 1 }, { id: 2}],
      [],
      [{ id: 3 }, { id: 4}],
    ]);

    _buildQueries(chunks$)
      .count()
      .subscribe(
        value => expect(value).toBe(2),
        done,
        done,
      );
  });
});

describe('_performTx', () => {
  const client: any = {
    startTx: () => Observable.of('START'),
    endTx: () => Observable.of('END'),
    abortTx: () => Observable.of('ABORT'),
    insert: () => Observable.of('INSERT'),
  };

  it('starts a tx', done => {
    const queries$ = Observable.from([]);

    _performTx(queries$, client)
      .first()
      .subscribe(
        value => expect(value).toBe('START'),
        done,
        done,
      );
  });

  it('ends a tx', done => {
    const queries$ = Observable.from([]);

    _performTx(queries$, client)
      .last()
      .subscribe(
        value => expect(value).toBe('END'),
        done,
        done,
      );
  });

  it('inserts', done => {
    const queries$ = Observable.from([
      { queryString: 'insert', params: [1, 2] },
      { queryString: 'insert', params: [2, 3] },
    ]);

    _performTx(queries$, client)
      .filter((val: any) => val === 'INSERT')
      .count()
      .subscribe(
        value => expect(value).toBe(2),
        done,
        done,
      );
  });

  it('aborts a tx on error', done => {
    const queries$: any = Observable.throw(new Error('fail'));

    _performTx(queries$, client)
      .last()
      .subscribe(
        value => expect(value).toBe('ABORT'),
        () => done(),
        undefined,
      );
  });
});
