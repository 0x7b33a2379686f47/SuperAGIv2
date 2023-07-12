import React, {useEffect, useRef, useState} from 'react';
import Image from "next/image";
import styles from '.././Toolkits/Tool.module.css';
import styles1 from '../Agents/Agents.module.css';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles2 from "./Market.module.css"
import styles3 from "../Knowledge/Knowledge.module.css"
import {EventBus} from "@/utils/eventBus";
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import {
  fetchKnowledgeTemplateOverview,
  getValidMarketplaceIndices,
  installKnowledgeTemplate
} from "@/pages/api/DashboardService";

export default function KnowledgeTemplate({template, env}) {
  const [installed, setInstalled] = useState('');
  const [dropdown,setDropdown] = useState(false);
  const [templateData,setTemplateData] = useState([]);
  const [markdownContent, setMarkdownContent] = useState('');
  const indexRef = useRef(null);
  const [indexDropdown, setIndexDropdown] = useState(false);
  const [pinconeIndices, setPineconeIndices] = useState([]);
  const [qdrantIndices, setQdrantIndices] = useState([]);

  useEffect(() => {
    getValidMarketplaceIndices(template.id)
      .then((response) => {
        const data = response.data || [];
        if(data) {
          setPineconeIndices(data.pinecone || []);
          setQdrantIndices(data.qdrant || []);
        }
      })
      .catch((error) => {
        console.error('Error fetching indices:', error);
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (indexRef.current && !indexRef.current.contains(event.target)) {
        setIndexDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if(template) {
      setInstalled(template.is_installed ? 'Installed' : 'Install');
    }

    if (window.location.href.toLowerCase().includes('marketplace')) {
      setInstalled('Sign in to install');
      axios.get(`https://app.superagi.com/api/knowledge/marketplace/get/details/${template.id}`)
        .then((response) => {
          const data = response.data || [];
          setTemplateData(data);
          if(data) {
            setMarkdownContent(data.readme);
          }
        })
        .catch((error) => {
          console.error('Error fetching template details:', error);
        });
    } else {
      fetchKnowledgeTemplateOverview(template.id)
        .then((response) => {
          const data = response.data || [];
          setTemplateData(data);
          if(data) {
            setMarkdownContent(data.readme);
          }
        })
        .catch((error) => {
          console.error('Error fetching template details:', error);
        });
    }
  }, []);

  const handleInstallClick = (indexId) => {
    if (window.location.href.toLowerCase().includes('marketplace')) {
      localStorage.setItem('knowledge_to_install', template.id);
      localStorage.setItem('knowledge_index_to_install', indexId);

      if (env === 'PROD') {
        window.open(`https://app.superagi.com/`, '_self');
      } else {
        window.location.href = '/';
      }
      return;
    }

    if (template && template.is_installed) {
      toast.error("Template is already installed", {autoClose: 1800});
      return;
    }

    installKnowledgeTemplate(template.id, indexId)
      .then((response) => {
        toast.success("Template installed", {autoClose: 1800});
        setInstalled('Installed');
      })
      .catch((error) => {
        console.error('Error installing template:', error);
      });
  }

  function handleBackClick() {
    EventBus.emit('goToMarketplace', {});
  }

  const uninstallKnowledge = () => {

  }

  return (
    <>
      <div>
        <div className="row" style={{marginLeft: 'auto'}}>
          <div className={styles2.back_button} style={{margin: '8px 0', padding: '2px'}}
               onClick={() => handleBackClick()}>
            <Image src="/images/arrow_back.svg" alt="back_button" width={14} height={12}/>
            <span className={styles2.back_button_text}>Back</span>
          </div>
          <div className="col-3" style={{maxHeight: '84vh', overflowY: 'auto', padding: '0'}}>
            <div className={styles2.left_container}>
              <span className={styles2.top_heading}>{templateData?.name}</span>
              <span style={{fontSize: '12px',marginTop: '15px',}} className={styles.tool_publisher}>by {templateData?.contributed_by}&nbsp;{'\u00B7'}&nbsp;<Image width={14} height={14} src="/images/upload_icon.svg" alt="upload-icon"/>{templateData?.install_number || 0}</span>

              {!template?.is_installed && <div className="dropdown_container_search" style={{width:'100%'}}>
                <div className="primary_button" onClick={() => setIndexDropdown(!indexDropdown)}
                     style={{marginTop:'15px',cursor: 'pointer',width:'100%'}}>
                  <Image width={14} height={14} src="/images/upload_icon_dark.svg" alt="upload-icon"/>&nbsp;{installed}
                </div>
                <div>
                  {indexDropdown && <div className="custom_select_options" ref={indexRef} style={{width:'100%',maxHeight:'500px'}}>
                    <div className={styles3.knowledge_label} style={{padding:'12px 14px',maxWidth:'100%'}}>Select an existing vector database collection/index to install the knowledge</div>
                    {pinconeIndices && pinconeIndices.length > 0 && <div className={styles3.knowledge_db} style={{maxWidth:'100%'}}>
                      <div className={styles3.knowledge_db_name}>Pinecone</div>
                      {pinconeIndices.map((index) => (<div key={index.id} className="custom_select_option" onClick={() => handleInstallClick(index.id)} style={{padding:'12px 14px',maxWidth:'100%'}}>
                        {index.name}
                      </div>))}
                    </div>}
                    {qdrantIndices && qdrantIndices.length > 0 && <div className={styles3.knowledge_db} style={{maxWidth:'100%'}}>
                      <div className={styles3.knowledge_db_name}>Qdrant</div>
                      {qdrantIndices.map((index) => (<div key={index.id} className="custom_select_option" onClick={() => handleInstallClick(index.id)} style={{padding:'12px 14px',maxWidth:'100%'}}>
                        {index.name}
                      </div>))}
                    </div>}
                  </div>}
                </div>
              </div>}

              {template?.is_installed && <div style={{width:'100%',display:'flex',justifyContent:'flex-start',marginTop:'15px'}}>
                <div className="secondary_button" style={{cursor: 'default',width:'85%'}}>
                  <Image width={14} height={14} src="/images/tick.svg" alt="tick-icon"/>&nbsp;{installed}
                </div>
                <div style={{width:'5%',marginLeft:'10px'}}>
                  <button className="secondary_button" style={{padding:'8px',height:'31px'}} onMouseEnter={() => setDropdown(true)} onMouseLeave={() => setDropdown(false)}>
                    <Image width={14} height={14} src="/images/three_dots.svg" alt="run-icon"/>
                  </button>
                  {dropdown && <div onMouseEnter={() => setDropdown(true)} onMouseLeave={() => setDropdown(false)}>
                    <ul className="dropdown_container" style={{marginTop:'0',width:'165px'}}>
                      <li className="dropdown_item" onClick={uninstallKnowledge}>Uninstall knowledge</li>
                    </ul>
                  </div>}
                </div>
              </div>}

              <hr className={styles2.horizontal_line} />

              <span className={styles2.description_text}>{templateData?.description}</span>

              <hr className={styles2.horizontal_line} />

              <span style={{fontSize: '12px'}} className={styles.tool_publisher}>Model(s)</span>
              <div className="tool_container" style={{marginTop:'10px',width: 'fit-content'}}>
                <div className={styles1.tool_text}>{templateData?.model}</div>
              </div><br />

              <span style={{fontSize: '12px'}} className={styles.tool_publisher}>Knowledge datatype</span>
              <div className="tool_container" style={{marginTop:'10px',width: 'fit-content'}}>
                <div className={styles1.tool_text}>{templateData?.data_type}</div>
              </div><br />

              <span style={{fontSize: '12px'}} className={styles.tool_publisher}>Tokenizer</span>
              <div className="tool_container" style={{marginTop:'10px',width: 'fit-content'}}>
                <div className={styles1.tool_text}>{templateData?.tokenizer}</div>
              </div><br />

              <span style={{fontSize: '12px'}} className={styles.tool_publisher}>Chunk size</span>
              <div className="tool_container" style={{marginTop:'10px',width: 'fit-content'}}>
                <div className={styles1.tool_text}>{templateData?.chunk_size}</div>
              </div><br />

              <span style={{fontSize: '12px'}} className={styles.tool_publisher}>Chunk overlap</span>
              <div className="tool_container" style={{marginTop:'10px',width: 'fit-content'}}>
                <div className={styles1.tool_text}>{templateData?.chunk_overlap}</div>
              </div><br />

              <span style={{fontSize: '12px'}} className={styles.tool_publisher}>Text splitter</span>
              <div className="tool_container" style={{marginTop:'10px',width: 'fit-content'}}>
                <div className={styles1.tool_text}>{templateData?.text_splitter}</div>
              </div><br />

              <span style={{fontSize: '12px'}} className={styles.tool_publisher}>Dimensions</span>
              <div className="tool_container" style={{marginTop:'10px',width: 'fit-content'}}>
                <div className={styles1.tool_text}>{templateData?.dimensions}</div>
              </div>

              <hr className={styles2.horizontal_line} />

              <span style={{fontSize: '12px',}} className={styles.tool_publisher}>Last updated</span>
              <span className={styles2.description_text}>{templateData?.updated_at}</span>
            </div>
          </div>
          <div className="col-9" style={{paddingLeft: '8px'}}>
            <div className={styles2.left_container} style={{marginBottom: '8px'}}>
              <div className={styles2.markdown_container}>
                {markdownContent && markdownContent !== '' ? <ReactMarkdown
                    className={styles2.markdown_style}>{markdownContent}</ReactMarkdown> :
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',marginTop:'40px',width:'100%'}}>
                    <Image width={150} height={60} src="/images/no_permissions.svg" alt="no-permissions" />
                    <span className={styles1.feed_title} style={{marginTop: '8px'}}>No Overview to display!</span>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer/>
    </>
  );
}