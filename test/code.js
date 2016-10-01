import chai from 'chai'
import hello from '../dev/hello.js'
import Month from '../dev/libs/util/Month.js'
var should = chai.should()

describe('hello.js', () => {
	context('echo', () => {
		it('should return Hello yamamoto when the value is yamamoto', () => {
			hello.testFunc('yamamoto').should.equal('Hello yamamoto')
		})
	})
})

describe('Month.js', () => {
	context('echo', () => {
		it('should return 1 when the value is January', () => {
			Month.getNumber('January').should.equal(1)
		})
		it('should return 2 when the value is February', () => {
			Month.getNumber('February').should.equal(2)
		})
	})
})