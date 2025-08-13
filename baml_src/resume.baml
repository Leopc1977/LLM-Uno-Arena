// Defining a data model.
class Resume {
  randomNumber int
}

// Create a function to extract the resume from a string.
function ExtractResume(resume: string) -> Resume {
  client "Qwen3"
  prompt #"
    {{ resume }}

    {{ ctx.output_format }}
  "#
}

// Test the function with a sample resume. Open the VSCode playground to run this.
test vaibhav_resume {
  functions [ExtractResume]
  args {
    resume #"

    "#
  }
}
