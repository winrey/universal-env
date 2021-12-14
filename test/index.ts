import Envs from '../src/index';

it("should be init successfully", () => {
  expect(Envs.init())
})

it("register should work", () => {
  Envs.init()
  const [KEY, VALUE] = ["KEY", "VALUE"]
  Envs.register(KEY, VALUE)
  expect(Envs.get(KEY)).toBe(VALUE)
})

it("vars should work", () => {
  const [KEY, VALUE] = ["KEY", "VALUE"]
  Envs.init({vars: {[KEY]: VALUE}})
  expect(Envs.get(KEY)).toBe(VALUE)
})
