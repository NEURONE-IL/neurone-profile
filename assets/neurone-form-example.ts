const exampleForm = {
  "formName": "example_file",
  "questions": [
    {
      "title": "Form name not found in database! An example form has been sent.",
      "hint": "Example Hint",
      "name": "inputExample",
      "type": "input",
      "validators": {
        "required": true,
        "minLength": 10,
        "maxLength": 20
      }
    },
    {
      "title": "Example Title",
      "hint": "Example Hint",
      "name": "paraExample",
      "placeholder": "This is a placeholder.",
      "rows": "4",
      "type": "paragraph",
      "validators": {
        "required": false,
        "minLength": 2
      }
    },
    {
      "title": "Example Checkboxes",
      "hint": "Example Hint",
      "name": "checkboxExample",
      "choices": ["Example 1", "Option 2", "Select 3"],
      "type": "checkbox",
      "validators": {
        "required": false
      }
    },
    {
      "title": "Example Title",
      "hint": "Example Hint",
      "name": "radioExample",
      "type": "radio",
      "choices": ["Example 1", "Example 2", "Example 3"],
      "validators": {
        "required": false
      }
    },
    {
      "title": "Pick An option",
      "hint": "Example Hint",
      "name": "dropdownExample",
      "type": "dropdown",
      "choices": ["Example 1", "Example 2", "Example 3"],
      "validators": {
        "required": true
      }
    },
    {
      "title": "Choose a Date",
      "hint": "Could be your birthday!",
      "name": "dateExample",
      "type": "datepicker",
      "choices": ["Example 1", "Example 2", "Example 3"],
      "validators": {
        "required": false
      }
    },
    {
      "title": "Rate this question",
      "hint": "Pick anything!",
      "name": "scaleExample",
      "type": "scale",
      "scaleOptions": {
        "min": 0,
        "max": 100,
        "step": 50,
        "minLabel": "bad",
        "maxLabel": "life saving"
      },
      "validators": {
        "required": true
      }
    },
    {
      "title": "How many stars?",
      "hint": "Pick anything!",
      "name": "ratingExample",
      "type": "rating",
      "stars": 6,
      "validators": {
        "required": true
      }
    }
  ]
}

export default exampleForm;