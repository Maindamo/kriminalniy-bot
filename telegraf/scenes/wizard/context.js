class WizardContext {
  constructor (ctx, steps) {
    this.ctx = ctx
    this.steps = steps
    this.state = ctx.scene.state
    this.cursor = ctx.scene.session.cursor || 0
  }

  get step () {
    return this.cursor >= 0 && this.steps[this.cursor]
  }

  selectStep (index) {
    this.cursor = index
    this.ctx.scene.session.cursor = index
    return this
  }

  next () {
    return this.selectStep(this.cursor + 1)
  }

  back () {
    return this.selectStep(this.cursor - 1)
  }

  prevStep(){
    this.cursor--;
    if (this.cursor < 0) this.cursor = 0;
    this.selectStep(this.cursor);
    return this.steps[this.cursor](this.ctx);
  }
  
  nextStep(ctx) {
    this.cursor++;
    if (this.cursor > this.steps.length - 1)
      this.cursor = this.steps.length - 1;
    this.selectStep(this.cursor);
    return this.steps[this.cursor](this.ctx);
  }

  chooseStep(step) {
    this.cursor = step;
    if (this.cursor > this.steps.length - 1)
      this.cursor = this.steps.length - 1;
    this.selectStep(this.cursor);
    return this.steps[this.cursor](this.ctx);
  }
}

module.exports = WizardContext
