import { useState } from "react";

const withModal = ModalComponent => WrapperComponent => {
  return function(props) {

    // const [modalShow, setModalShow] = useState(false);
    const [modalState, setModalState] = useState({ show: false, data: {} });

    const toggleModal = (show, data = {}) => {
      setModalState({ show, data });
    };

    return (
      <>
        <WrapperComponent show={toggleModal} {...props} />
        {modalState.show && <ModalComponent {...modalState.data} show={toggleModal} onHide={() => setModalState({ show: false, data: {} })} />}
      </>
    );
  };
};

export default withModal;
