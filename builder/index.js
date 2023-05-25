//Builder pattern aims to “Separate the construction of a complex object from its representation so that the same construction process can create different representations.”
// It is used to construct a complex object step by step and the final step will return the object.
// The process of constructing an object should be generic so that it can be used to create different representations of the same object.

class Tag {
  static get indentSize() {
    return 2;
  }

  constructor(name = "", text = "") {
    this.name = name;
    this.text = text;
    this.children = [];
  }

  toStringImpl(indent) {
    let html = [];
    let i = " ".repeat(indent * Tag.indentSize);
    html.push(`${i}<${this.name}>\n`);
    if (this.text.length > 0) {
      html.push(" ".repeat(Tag.indentSize * (indent + 1)));
      html.push(this.text);
      html.push("\n");
    }

    for (let child of this.children) html.push(child.toStringImpl(indent + 1));

    html.push(`${i}</${this.name}>\n`);
    return html.join();
  }

  toString() {
    return this.toStringImpl(0);
  }

  static create(name) {
    return new HtmlBuilder(name);
  }
}

class HtmlBuilder {
  constructor(rootName) {
    this.root = new Tag(rootName);
    this.rootName = rootName;
  }

  // non-fluent
  addChild(childName, childText) {
    let child = new Tag(childName, childText);
    this.root.children.push(child);
  }

  // fluent
  addChildFluent(childName, childText) {
    let child = new Tag(childName, childText);
    this.root.children.push(child);
    return this;
  }

  toString() {
    return this.root.toString();
  }

  clear() {
    this.root = new Tag(this.rootName);
  }

  build() {
    return this.root;
  }
}

// just a single paragraph using string concatenation
const hello = "hello";
let html = [];
html.push("<p>");
html.push(hello);
html.push("</p>");
console.log(html.join());

// a list with 2 words in it
const words = ["hello", "world"];
html = [];
html.push("<ul>\n");
for (let word of words) html.push(`  <li>${word}</li>\n`);
html.push("</ul>");
console.log(html.join());

// ordinary non-fluent builder
//let builder = new HtmlBuilder('ul');
let builder = Tag.create("ul");
for (let word of words) builder.addChild("li", word);
//console.log(builder.toString());
let tag = builder.build();
console.log(tag.toString());

// fluent builder
builder.clear();
builder
  .addChildFluent("li", "foo")
  .addChildFluent("li", "bar")
  .addChildFluent("li", "baz");
console.log(builder.toString());

class Person {
  constructor() {
    // address info
    this.streetAddress = this.postcode = this.city = "";

    // employment info
    this.companyName = this.position = "";
    this.annualIncome = 0;
  }

  toString() {
    return (
      `Person lives at ${this.streetAddress}, ${this.city}, ${this.postcode}\n` +
      `and works at ${this.companyName} as a ${this.position} earning ${this.annualIncome}`
    );
  }
}

// builder facets
class PersonBuilder {
  constructor(person = new Person()) {
    this.person = person;
  }

  get lives() {
    return new PersonAddressBuilder(this.person);
  }

  get works() {
    return new PersonJobBuilder(this.person);
  }

  build() {
    return this.person;
  }
}

class PersonJobBuilder extends PersonBuilder {
  constructor(person) {
    super(person);
  }

  at(companyName) {
    this.person.companyName = companyName;
    return this;
  }

  asA(position) {
    this.person.position = position;
    return this;
  }

  earning(annualIncome) {
    this.person.annualIncome = annualIncome;
    return this;
  }
}

class PersonAddressBuilder extends PersonBuilder {
  constructor(person) {
    super(person);
  }

  at(streetAddress) {
    this.person.streetAddress = streetAddress;
    return this;
  }

  withPostcode(postcode) {
    this.person.postcode = postcode;
    return this;
  }

  in(city) {
    this.person.city = city;
    return this;
  }
}

let pb = new PersonBuilder();
let person = pb.lives
  .at("123 London Road")
  .in("London")
  .withPostcode("SW12BC")
  .works.at("Fabrikam")
  .asA("Engineer")
  .earning(123000)
  .build();
console.log(person.toString());
