import React from "react";
import { Charts } from "../charts";
import * as jsPDF from "jspdf";
import $ from "jquery";

export class Details extends React.Component {
  constructor() {
    super();
    this.state = {
      schoolDetails: [],
      isLoaded: false
    };
  }

  printPdf = e => {
    window.print();
  };

  downloadPdf = e => {
    var doc = new jsPDF();
    doc.fromHTML(
      $("#content")[0],
      15,
      15,
      {
        background: "#fff"
      },
      function() {
        doc.save("sample-file.pdf");
      }
    );
  };

  componentDidMount() {
    this.setState({ isLoaded: false });
    fetch(
      "https://api.data.gov/ed/collegescorecard/v1/schools?api_key=z0TVIOuxTXcJg7QbIQTpx7PU8M3fYM9xDGqdmDSV"
    )
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            schoolDetails: result.results
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  render() {
    const { schoolDetails } = this.state;
    return (
      <div className="container-fluid">
        <div id="editor" />
        {!this.state.isLoaded ? (
          <div className="text-center">Loading . . .</div>
        ) : (
          <div>
            <div className="row" style={{ display: "inline-block" }}>
              <div style={{ padding: "20px" }}>
                <h1>Education Details </h1>
              </div>
              <button className="btn btn-primary" onClick={this.downloadPdf}>
                Download Pdf
              </button>
              <button
                className="btn btn-primary"
                style={{ marginLeft: "20px" }}
                onClick={this.printPdf}
              >
                Print
              </button>
            </div>
            <div id="content">
              <div className="row">
                {schoolDetails.map(e => {
                  return (
                    <div className="col-md-3" key={e.school.name}>
                      <div
                        className="card"
                        style={{ height: "520px", margin: "10px 0" }}
                      >
                        <div className="card-body">
                          <h6 className="card-title">{e.school.name}</h6>
                          <a
                            className="card-subtitle mb-2"
                            href={e.school.school_url}
                          >
                            {e.school.school_url}
                          </a>
                          <p className="card-text">
                            <strong>City </strong>:{" " + e.school.city}
                          </p>
                          <p className="card-text">
                            <strong>State </strong>:{" " + e.school.state}
                          </p>
                          <p className="card-text">
                            <strong>Zip </strong>:{" " + e.school.zip}
                          </p>
                          <p className="card-text">
                            <strong>Total student </strong>:
                            {e.latest.student.size !== null
                              ? " " + e.latest.student.size
                              : " 0"}
                          </p>
                          <div
                            id="chart-section"
                            style={{
                              position: "relative",
                              zIndex: "5",
                              top: "-12px",
                              display: "inline-block"
                            }}
                          >
                            <div>Program percentage</div>
                            <Charts
                              data={e["2017"].academics.program_percentage}
                              showPercentage={true}
                            />
                            <div>Race/Ethinicity</div>
                            <Charts
                              data={
                                e["2017"].student.demographics.race_ethnicity
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <hr />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
