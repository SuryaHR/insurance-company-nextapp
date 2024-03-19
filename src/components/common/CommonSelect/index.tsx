// "use client";
// import React, { Component, useState } from "react";
// // import { colourOptions } from "./data.js";
// // import MySelect from "./SelectComponenet";
// // import { components } from "react-select";
// // import commonSelectStyle from "./commonSelect.module.scss";

// const Option = (props: any) => {
//   return (
//     <div className={commonSelectStyle.options}>
//       <components.Option {...props}>
//         <input type="checkbox" checked={props.isSelected} onChange={() => null} />{" "}
//         <label>{props.label}</label>
//       </components.Option>
//     </div>
//   );
// };

// const MultiValue = (props: any) => (
//   <components.MultiValue {...props}>
//     <span>{props.data.label}</span>
//   </components.MultiValue>
// );

// // const animatedComponents = makeAnimated();
// // class Example extends Component {
// //   constructor(props: any) {
// //     super(props);
// //     this.state = {
// //       optionSelected: null,
// //     };
// //   }

// //   handleChange = (selected: any) => {
// //     this.setState({
// //       optionSelected: selected,
// //     });
// //   };

// //   render() {
// //     return (
// //       <div>
// //         <MySelect
// //           options={colourOptions}
// //           isMulti
// //           closeMenuOnSelect={false}
// //           hideSelectedOptions={false}
// //           components={{ Option, MultiValue }}
// //           onChange={this.handleChange}
// //           allowSelectAll={true}
// //           value={this.state.optionSelected}
// //           className={commonSelectStyle.commonSelect}
// //         />
// //       </div>
// //     );
// //   }
// // }

// export default function () {
//   // const [optionSelected, setOptionSelected] = useState(null);

//   // const handleChange = (selected: any) => {
//   //   setOptionSelected(selected);
//   // };

//   return (
//     <div>
//       {/* <MySelect
//         options={colourOptions}
//         isMulti
//         closeMenuOnSelect={false}
//         hideSelectedOptions={false}
//         components={{ Option, MultiValue }}
//         onChange={handleChange}
//         allowSelectAll={true}
//         value={optionSelected}
//         className={commonSelectStyle.commonSelect}
//       /> */}
//     </div>
//   );
// }

// // const rootElement = document.getElementById("root");
// // ReactDOM.render(<Example />, rootElement);
