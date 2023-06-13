import React, {useEffect, useState} from 'react';
import Image from "next/image";
import styles from '../Tools/Tool.module.css';
import styles1 from '../Agents/Agents.module.css'
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles2 from "./Market.module.css"
import EachToolOverview from "./EachToolOverview"
import {fetchAgentTemplateConfig, fetchAgentTemplateList} from "@/pages/api/DashboardService";

export default function AgentTemplate({template}) {
    const [tools, setTools] = useState(['Gmailer','jira','openai','super agi','langchain','zapier','whatsapp'])
    const [templateConfigs, setTemplateConfigs] = useState([])
    const [rightPanel, setRightPanel] = useState('overview')
    const [goals, setGoals] = useState([])
    useEffect(() => {
        fetchAgentTemplateConfig(template.id)
            .then((response) => {
                const data = response.data || [];
                console.log(data)
                setTemplateConfigs(data)
                console.log(goals)
            })
            .catch((error) => {
                console.error('Error fetching template details:', error);
            });
    }, [])

    return (
        <>
            <div>
                <div className="row" style={{marginLeft:'auto'}}>
                    <div className={styles2.back_button}>
                        {'\u2190'} Back
                    </div>
                    <div className="col-3" style={{maxHeight:'84vh',overflowY:'auto'}}>
                        <div className={styles2.left_container}>
                            <span className={styles2.top_heading}>{template.name}</span>
                            <span style={{fontSize: '12px',marginTop: '15px',}} className={styles.tool_publisher}>By SuperAGI <Image width={14} height={14} src="/images/is_verified.svg" alt="is_verified"/>&nbsp;{'\u00B7'}&nbsp;<Image width={14} height={14} src="/images/upload_icon.svg" alt="upload-icon"/>&nbsp;247</span>
                            <button className="primary_button" style={{marginTop:'15px',width:'100%'}}><Image width={14} height={14} src="/images/upload_icon_dark.svg" alt="upload-icon"/>&nbsp;Installed</button>
                        </div>
                        <div className={styles2.left_container} style={{marginTop:'0.7%'}}>
                            <span className={styles2.description_text}>{template.description}</span>
                        </div>
                        <div className={styles2.left_container} style={{marginTop:'0.7%'}}>
                            <span style={{fontSize: '12px',}} className={styles.tool_publisher}>Tools</span>
                            <div className={styles1.agent_info_tools} style={{marginTop:'10px'}}>
                                {tools.map((tool, index) => (<div key={index} className="tool_container" style={{marginTop:'0',marginBottom:'5px'}}>
                                    <div className={styles1.tool_text}>{tool || ''}</div>
                                </div>))}
                            </div><br />
                            <span style={{fontSize: '12px',}} className={styles.tool_publisher}>Agent Type</span>
                            <div className="tool_container" style={{marginTop:'10px'}}>
                                <div className={styles1.tool_text}>{templateConfigs.agent_type}</div>
                            </div><br />
                            <span style={{fontSize: '12px',}} className={styles.tool_publisher}>Model(s)</span>
                            <div className="tool_container" style={{marginTop:'10px'}}>
                                <div className={styles1.tool_text}>{templateConfigs.model}</div>
                            </div>
                        </div>
                        <div className={styles2.left_container} style={{marginTop:'0.7%'}}>
                            <span style={{fontSize: '12px',}} className={styles.tool_publisher}>Last updated</span>
                            <span className={styles2.description_text}>23 June 2023</span>
                        </div>
                    </div>
                    <div className="col-9">
                        {/*<div className={styles2.left_container} style={{marginBottom:'5px'}}>*/}
                        {/*    <div className="row">*/}
                        {/*        <div className="col-4">*/}
                        {/*            <button onClick={() => setRightPanel('overview')} className={styles2.tab_button} style={rightPanel === 'overview' ? {background:'#454254',paddingRight:'15px'} : {background:'transparent',paddingRight:'15px'}}>*/}
                        {/*                &nbsp;Overview*/}
                        {/*            </button>*/}
                        {/*            <button onClick={() => setRightPanel('tool_view')} className={styles2.tab_button} style={rightPanel === 'tool_view' ? {background:'#454254',paddingRight:'15px'} : {background:'transparent',paddingRight:'15px'}}>*/}
                        {/*                &nbsp;Tools Included*/}
                        {/*            </button>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <div style={{maxHeight:'84vh',overflowY:'auto'}}>
                           <div className={styles2.left_container} style={{marginBottom:'5px'}}>
                            <div>
                                <span className={styles2.description_heading} style={{fontWeight:'400'}}>Goals</span><br /><br />
                                {goals.map((goal, index) => (<div key={index} style={{marginTop:'0'}}>
                                    <div className={styles2.description_text}>{index + 1}. {goal || ''}</div>{index !== goals.length - 1 && <br/>}
                                </div>))}
                            </div>
                        </div>
                        {/*   <div className={styles2.left_container} style={{marginBottom:'5px'}}>*/}
                        {/*    <div>*/}
                        {/*        <span className={styles2.description_heading} style={{fontWeight:'400'}}>4 Instructions</span><br /><br />*/}
                        {/*        {goals.map((goal, index) => (<div key={index} style={{marginTop:'0'}}>*/}
                        {/*            <div className={styles2.description_text}>{index + 1}. {goal || ''}</div>{index !== goals.length - 1 && <br/>}*/}
                        {/*        </div>))}*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                           <div className={styles2.left_container} style={{marginBottom:'5px'}}>
                            <div>
                                <span className={styles2.description_heading} style={{fontWeight:'400'}}>Constraints</span><br /><br />
                                {goals.map((goal, index) => (<div key={index} style={{marginTop:'0'}}>
                                    <div className={styles2.description_text}>{index + 1}. {goal || ''}</div>{index !== goals.length - 1 && <br/>}
                                </div>))}
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </>
    );
}