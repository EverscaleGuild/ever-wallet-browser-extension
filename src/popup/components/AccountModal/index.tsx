import * as React from 'react'

import { hideModalOnClick } from '@popup/common'
import { Step, useAccountability } from '@popup/providers/AccountabilityProvider'
import { Panel, useDrawerPanel } from '@popup/providers/DrawerPanelProvider'
import { useRpc } from '@popup/providers/RpcProvider'
import { useRpcState } from '@popup/providers/RpcStateProvider'
import { getScrollWidth } from '@popup/utils/getScrollWidth'

import Profile from '@popup/img/profile.svg'

import { ENVIRONMENT_TYPE_NOTIFICATION } from '@shared/constants'
import { convertAddress } from '@shared/utils'

import manifest from '../../../manifest.json'

import './style.scss'


export function AccountModal() {
    const accountability = useAccountability()
    const drawer = useDrawerPanel()
    const rpc = useRpc()
    const rpcState = useRpcState()

    const wrapperRef = React.useRef(null)

    const [isActive, setActiveTo] = React.useState(false)

    const scrollWidth = React.useMemo(() => getScrollWidth(), [])

    const selectedSeedName = React.useMemo(() => {
        if (accountability.selectedMasterKey !== undefined) {
            return (
                accountability.masterKeysNames[accountability.selectedMasterKey] ||
                convertAddress(accountability.selectedMasterKey)
            )
        }
        return undefined
    }, [accountability.masterKeysNames, accountability.selectedMasterKey])

    const hide = () => {
        setActiveTo(false)
    }

    const toggle = () => {
        setActiveTo(!isActive)
    }

    const onManageMasterKey = (masterKey: string) => {
        return () => {
            const key = accountability.masterKeys.find((entry) => entry.masterKey === masterKey)

            if (key == null) {
                return
            }

            hide()

            accountability.setCurrentMasterKey(key)
            accountability.setStep(Step.MANAGE_SEED)
            drawer.setPanel(Panel.MANAGE_SEEDS)
        }
    }

    const onManageSeeds = async () => {
        hide()

        if (rpcState.activeTab?.type == ENVIRONMENT_TYPE_NOTIFICATION) {
            drawer.setPanel(Panel.MANAGE_SEEDS)
        } else {
            await rpc.openExtensionInExternalWindow({
                group: 'manage_seeds',
                width: 360 + scrollWidth - 1,
                height: 600 + scrollWidth - 1,
            })
            window.close()
        }
    }

    hideModalOnClick(wrapperRef, hide)

    return (
        <>
            <div className="account-details__profile-icon" onClick={toggle}>
                <img src={Profile} alt="" />
            </div>

            {isActive && (
                <div ref={wrapperRef} className="account-settings noselect">
                    <div className="account-settings-section">
                        <div className="account-settings-section-header">
                            Current seed {selectedSeedName !== undefined && `(${selectedSeedName})`}
                        </div>
                    </div>

                    <div className="account-settings-separator" />

                    <div className="account-settings-section">
                        <div className="account-settings-section-header">Recent seeds</div>

                        <ul className="account-settings__seeds-list">
                            {accountability.recentMasterKeys.map((key) => (
                                <li key={key.masterKey}>
                                    <a
                                        role="button"
                                        className="account-settings__seeds-list-item"
                                        onClick={onManageMasterKey(key.masterKey)}
                                    >
                                        <div className="account-settings__seeds-list-item-title">
                                            {accountability.masterKeysNames?.[key.masterKey] ||
                                                convertAddress(key.masterKey)}
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>

                        <div className="account-settings-section-item" onClick={onManageSeeds}>
                            Manage seeds & accounts
                        </div>
                    </div>

                    <div className="account-settings-separator" />

                    <div
                        className="account-settings-section-item-log-out"
                        onClick={accountability.logOut}
                    >
                        Log out
                    </div>
                    <div className="account-settings-section-item-version">
                        Version: {(manifest as any).version}
                    </div>
                </div>
            )}
        </>
    )
}
