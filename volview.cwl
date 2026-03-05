cwlVersion: v1.2
class: CommandLineTool
baseCommand: [GUI]

label: "VolView"
doc: |
  This tool is a 3D medical image viewer.

inputs:
  dicom_file:
    type: File
    label: "Input DICOM file"
    doc: "Medical image file in DICOM format."
    inputBinding:
      position: 1

outputs:
  output:
    type: File
    label: "Output DICOM file"
    outputBinding:
      glob: "output.dcm"

stdout: output.txt
